import React, { Component } from "react";
import graphql from "../../../graphql";
import moment from "moment";
import {
    SectionRow,
    SectionRowContent,
    SectionRowTitle,
} from "../../../components/section";
import {
    Button,
    Collapse,
} from "reactstrap";
import settings from "../../../settings";
import LoadingSpinner from "../../../components/loading";


function fetchInstitutions(onResult) {
    graphql.query(`
    {
      institutions {
        id
        name
            latest_mou {
                id
                date_expiration
            }
            latest_moa {
                id
                date_expiration
            }
      }
    }
    `).then(onResult);
}

function fetchMemorandumDetails(id, onResult) {
    graphql.query(`
    {
      memorandum(id: ${id}) {
        id
        category
        memorandum_file
        date_effective
        date_expiration
        college_initiator
        linkages
      }
    }
    `).then(onResult);
}

function memorandumIsFetched(memorandum) {
    return memorandum.category !== undefined;
}

function makeCardInfo(memorandumType, institution, memorandum) {
    return {
        institution : {
            name : institution.name,
            id : institution.id,
        },
        memorandum : {
            id : memorandum.id,
            type : memorandumType,
            dateEffective : moment(memorandum.date_effective),
            dateExpiration : moment(memorandum.date_expiration),
        },
    };
}

function makeCardsFromInstitution(institutions) {
    let cards = [];


    institutions.forEach(institution => {
        if (institution.latest_mou !== null && institution.latest_mou.date_expiration !== null) {
            cards.push(makeCardInfo("Understanding", institution, institution.latest_mou));
        }

        if (institution.latest_moa !== null && institution.latest_moa.date_expiration !== null) {
            cards.push(makeCardInfo("Agreement", institution, institution.latest_moa));
        }
    });


    cards.sort((a, b) => {
        return a.memorandum.dateExpiration.diff(b.memorandum.dateExpiration);
    });

    return cards;
}

class Memorandums extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cards : null,
            activeCard : null,
        };

        this.refreshCards = this.refreshCards.bind(this);
        this.setActiveCard = this.setActiveCard.bind(this);

        fetchInstitutions(result => {
            const institutions = result.institutions;
            this.setState({
                cards : makeCardsFromInstitution(institutions),
            });
        });
    }

    static emptyState() {
        return (
            <h5>There are no memorandums found with an expiration date</h5>
        );
    }

    refreshCards() {
        this.setState({
            cards : null //clear first
        });

        fetchInstitutions(result => {
            const institutions = result.institutions;
            this.setState({
                cards : makeCardsFromInstitution(institutions),
            });
        });
    }

    setActiveCard(id) {
        if (this.state.activeCard === id) {
            this.setState({
                activeCard : null //Deselect when already selected
            });

            return;
        }

        this.setState({
            activeCard : id,
        });

    }

    render() {
        if (this.state.cards === null) {
            return <LoadingSpinner/>;
        }

        if (this.state.cards.length === 0) {
            return Memorandums.emptyState();
        }

        const cards = this.state.cards.map(card => {
            const id = card.memorandum.id;
            const isActive = this.state.activeCard === id;
            const setActiveCard = () => this.setActiveCard(id);
            return <MemorandumCard key={id} card={card} onClick={setActiveCard} active={isActive}/>;
        });

        return (
            <div className="d-flex flex-column align-items-center page-body p-4">
                {cards}
            </div>
        );
    }
}

class MemorandumCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const dateExpiration = this.props.card.memorandum.dateExpiration.format("LL");
        const expirationToNow = this.props.card.memorandum.dateExpiration.fromNow();

        const now = moment();
        const dateExpirationMoment = this.props.card.memorandum.dateExpiration;
        const monthsBeforeExpiration = dateExpirationMoment.diff(now, "months");
        const hasExpired = dateExpirationMoment.diff(now, "days") <= 0;

        const urgent = monthsBeforeExpiration <= 6;

        let expirationClass = "text-white ";
        if (urgent) {
            expirationClass += "bg-danger";
        } else {
            expirationClass += "bg-dlsu-lighter";
        }

        let cardClass = "home-card rounded ";
        if (this.props.active) {
            cardClass += "active";
        }

        let collapseContent = null;

        if (memorandumIsFetched(this.props.card.memorandum) || this.props.active) {
            //Have we fetched it yet? This way we only mount those that have been fetched
            //or if it hasn't been fetched but is active.
            collapseContent =
                <div>
                    <MemorandumCardCollapseContent memorandum={this.props.card.memorandum}/>
                </div>;
        }


        return (
            <div className={cardClass} onClick={this.props.onClick} ref={(card) => this.card = card}>
                <SectionRow className={expirationClass}>
                    <SectionRowContent large>{hasExpired ? "Expired " : "Expires"} {expirationToNow}</SectionRowContent>
                </SectionRow>
                <SectionRow>
                    <SectionRowTitle>Institution Name</SectionRowTitle>
                    <SectionRowContent large>{this.props.card.institution.name}</SectionRowContent>
                </SectionRow>
                <SectionRow>
                    <SectionRowTitle>Memorandum Type</SectionRowTitle>
                    <SectionRowContent large>{this.props.card.memorandum.type}</SectionRowContent>
                </SectionRow>
                <SectionRow>
                    <SectionRowTitle>Date of Expiration</SectionRowTitle>
                    <SectionRowContent large>{dateExpiration}</SectionRowContent>
                </SectionRow>
                <Collapse isOpen={this.props.active}>
                    {collapseContent}
                </Collapse>
            </div>
        );
    }
}

class MemorandumCardCollapseContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            memorandum : props.memorandum,
        };

        fetchMemorandumDetails(props.memorandum.id, result => {
            let memorandum = result.memorandum;
            let stateMemorandum = this.state.memorandum;

            // Store fetched information in the instance
            stateMemorandum.category = memorandum.category;
            stateMemorandum.memorandum_file = memorandum.memorandum_file;
            stateMemorandum.date_effective = memorandum.date_effective;
            stateMemorandum.college_initiator = memorandum.college_initiator;
            stateMemorandum.linkages = memorandum.linkages;
        });
    }

    render() {
        const memorandum = this.state.memorandum;

        if (!memorandumIsFetched(memorandum)) {
            return (
                <div className="card-details">
                    <LoadingSpinner noText/>
                </div>
            );
        }


        const dateEffective = moment(memorandum.date_effective).format("LL");

        let collegeInitiator = "No college initiator";
        if (memorandum.college_initiator !== null) {
            collegeInitiator = settings.colleges[memorandum.college_initiator];
        }

        let linkages = "No linkages";
        if (memorandum.linkages.length > 0) {
            linkages = "";

            memorandum.linkages.forEach((linkage, index) => {
                const linkageString = settings.linkages[linkage];
                if (index === memorandum.linkages.length - 1) {
                    linkages += linkageString;
                } else {
                    linkages += linkageString + ", ";
                }
            });
        }

        return (
            <div className="card-details fetched">
                <SectionRow>
                    <SectionRowTitle>Date Effective</SectionRowTitle>
                    <SectionRowContent large>{dateEffective}</SectionRowContent>
                </SectionRow>
                <SectionRow>
                    <SectionRowTitle>College Initiator</SectionRowTitle>
                    <SectionRowContent large>{collegeInitiator}</SectionRowContent>
                </SectionRow>
                <SectionRow>
                    <SectionRowTitle>Linkages</SectionRowTitle>
                    <SectionRowContent large>{linkages}</SectionRowContent>
                </SectionRow>
                <SectionRow>
                    <Button outline size="sm" color="success" className="mr-2">View memorandum document</Button>
                    <Button outline size="sm" color="success">Renew Memorandum</Button>
                </SectionRow>
            </div>
        );

    }
}

export default Memorandums;