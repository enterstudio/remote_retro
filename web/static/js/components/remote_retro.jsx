import React, { Component, PropTypes } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Presence } from "phoenix"

import * as userActionCreators from "../actions/user"
import * as ideaActionCreators from "../actions/idea"
import * as AppPropTypes from "../prop_types"
import Room from "./room"
import ShareRetroLinkModal from "./share_retro_link_modal"

export class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: "idea-generation",
    }
  }

  componentWillMount() {
    const { retroChannel, actions } = this.props

    retroChannel.join()
      .receive("ok", retroState => {
        this.setState(retroState)
        actions.ideas.setIdeas(retroState.ideas)
      })
      .receive("error", error => console.error(error))

    retroChannel.on("presence_state", presences => {
      const users = Presence.list(presences, (_username, presence) => (presence.user))
      actions.users.setUsers(users)
    })

    retroChannel.on("new_idea_received", newIdea => {
      actions.ideas.addIdea(newIdea)
    })

    retroChannel.on("proceed_to_next_stage", payload => {
      this.setState({ stage: payload.stage })
      if (payload.stage === "action-item-distribution") {
        alert(
          "The facilitator has distibuted this retro's action items. You will receive an email breakdown shortly."
        )
      }
    })

    retroChannel.on("user_typing_idea", payload => {
      actions.users.updateUser(payload.userToken, { is_typing: true, last_typed: Date.now() })

      const interval = setInterval(() => {
        const { users } = this.props
        const user = users.find(user => user.token === payload.userToken)
        const noNewTypingEventsReceived = (Date.now() - user.last_typed) > 650
        if (noNewTypingEventsReceived) {
          clearInterval(interval)
          actions.users.updateUser(user.token, { is_typing: false })
        }
      }, 10)
    })

    retroChannel.on("enable_edit_state", nominatedIdea => {
      actions.ideas.updateIdea(nominatedIdea.id, { editing: true })
    })

    retroChannel.on("disable_edit_state", disabledIdea => {
      actions.ideas.updateIdea(disabledIdea.id, { editing: false, liveEditText: null })
    })

    retroChannel.on("idea_live_edit", editedIdea => {
      actions.ideas.updateIdea(editedIdea.id, editedIdea)
    })

    retroChannel.on("idea_edited", editedIdea => {
      const updatedIdea = { ...editedIdea, editing: false, liveEditText: null }
      actions.ideas.updateIdea(editedIdea.id, updatedIdea)
    })

    retroChannel.on("idea_deleted", deletedIdea => {
      actions.ideas.deleteIdea(deletedIdea.id)
    })
  }

  render() {
    const { users, ideas, userToken, retroChannel } = this.props
    const { stage, inserted_at } = this.state

    const currentUser = users.find(user => user.token === userToken)

    return (
      <div>
        <Room
          currentUser={currentUser}
          users={users}
          ideas={ideas}
          stage={stage}
          retroChannel={retroChannel}
        />
        <ShareRetroLinkModal insertedAt={inserted_at}/>
      </div>
    )
  }
}

RemoteRetro.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.users,
  userToken: PropTypes.string.isRequired,
}

RemoteRetro.defaultProps = {
  users: [],
}

const mapStateToProps = state => ({
  users: state.user,
  ideas: state.idea,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(userActionCreators, dispatch),
    ideas: bindActionCreators(ideaActionCreators, dispatch),
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteRetro)
