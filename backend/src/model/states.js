// states.js
const STATES = {
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
};

const TRANSITIONS = {
    PENDING: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
};

class StatusMachine {
    constructor(initialState = STATES.PENDING) {
        this.state = initialState;
    }

    canTransitionTo(nextState) {
        const allowed = TRANSITIONS[this.state] || [];
        return allowed.includes(nextState);
    }

    transitionTo(nextState) {
        if (this.canTransitionTo(nextState)) {
            this.state = nextState;
            return true;
        } else {
            throw new Error(`Transición inválida de ${this.state} a ${nextState}`);
        }
    }

    getState() {
        return this.state;
    }
}

module.exports = { STATES, StatusMachine };
