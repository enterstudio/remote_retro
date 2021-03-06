import React, { Component } from "react"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { actions, selectors } from "../redux"

import * as AppPropTypes from "../prop_types"
import Room from "./room"
import Alert from "./alert"
import DoorChime from "./door_chime"
import STAGES from "../configs/stages"

const { CLOSED } = STAGES

export function isNewFacilitator(prevCurrentUser, currentUser) {
  return ((prevCurrentUser.is_facilitator !== currentUser.is_facilitator)
    && currentUser.is_facilitator)
}

export class RemoteRetro extends Component {
  // Trigger analytics events on page load and stage changes
  componentDidMount() {
    hj("trigger", this.props.stage)
  }

  componentDidUpdate(prevProps) {
    const { stage, actions, currentUser } = this.props
    if (prevProps.stage !== stage) { hj("trigger", stage) }

    if (prevProps.presences.length) {
      const prevCurrentUser = prevProps.currentUser
      if (isNewFacilitator(prevCurrentUser, currentUser) && stage !== CLOSED) {
        actions.changeFacilitator(prevProps.facilitatorName)
      }
    }
  }

  render() {
    const {
      presences,
      ideas,
      retroChannel,
      stage,
      alert,
      currentUser,
      facilitatorName,
    } = this.props

    return (
      <div className={stage}>
        <Room
          currentUser={currentUser}
          facilitatorName={facilitatorName}
          presences={presences}
          ideas={ideas}
          stage={stage}
          retroChannel={retroChannel}
        />
        <Alert config={alert} />
        <DoorChime presences={presences} />
      </div>
    )
  }
}

RemoteRetro.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  presences: AppPropTypes.presences,
  ideas: AppPropTypes.ideas,
  userToken: PropTypes.string.isRequired,
  stage: AppPropTypes.stage.isRequired,
  alert: PropTypes.object,
  actions: PropTypes.object,
  currentUser: AppPropTypes.presence.isRequired,
  facilitatorName: PropTypes.string.isRequired,
}

RemoteRetro.defaultProps = {
  currentUser: {},
  facilitatorName: "",
  presences: [],
  ideas: [],
  alert: null,
  actions: {},
}

const mapStateToProps = state => ({
  ...state,
  currentUser: selectors.findCurrentUser(state.presences),
  facilitatorName: selectors.findFacilitatorName(state.presences),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteRetro)
