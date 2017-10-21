import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import * as AppPropTypes from "../prop_types"
import Room from "./room"
import Alert from "./alert"
import ShareRetroLinkModal from "./share_retro_link_modal"
import DoorChime from "./door_chime"

export class RemoteRetro extends Component {
  // Trigger analytics events on page load and stage changes
  componentDidMount() {
    hj("trigger", this.props.stage)
  }

  componentDidUpdate(prevProps) {
    const { stage } = this.props
    if (prevProps.stage !== stage) { hj("trigger", stage) }
  }

  render() {
    const { users, ideas, userToken, retroChannel, stage, insertedAt, alert } = this.props

    const currentUser = users.find(user => user.token === userToken)

    return (
      <div className={stage}>
        <Room
          currentUser={currentUser}
          users={users}
          ideas={ideas}
          stage={stage}
          retroChannel={retroChannel}
        />
        <Alert config={alert} />
        <ShareRetroLinkModal retroCreationTimestamp={insertedAt} />
        <DoorChime users={users} />
      </div>
    )
  }
}

RemoteRetro.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.users,
  ideas: AppPropTypes.ideas,
  userToken: PropTypes.string.isRequired,
  stage: AppPropTypes.stage.isRequired,
  insertedAt: PropTypes.string,
  alert: PropTypes.object,
}

RemoteRetro.defaultProps = {
  users: [],
  ideas: [],
  insertedAt: null,
  alert: null,
}

const mapStateToProps = state => ({ ...state })

export default connect(
  mapStateToProps
)(RemoteRetro)
