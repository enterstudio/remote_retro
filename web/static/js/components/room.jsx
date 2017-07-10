import React from "react"
import { CSSTransitionGroup } from "react-transition-group"

import UserList from "./user_list"
import IdeaBoard from "./idea_board"
import IdeaSubmissionForm from "./idea_submission_form"
import StageProgressionButton from "./stage_progression_button"
import stageProgressionConfigs from "../configs/stage_progression_configs"

import DoorChime from "./door_chime"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/room.css"

const Room = props => {
  const { currentUser, users, stage } = props
  const isFacilitator = currentUser.is_facilitator
  const progressionConfig = stageProgressionConfigs[stage]
  const showActionItem = stage !== "idea-generation"

  function wereActionItemsSubmitted() {
    return showActionItem && !props.ideas.some(idea => idea.category === "action-item")
  }

  return (
    <section className={styles.wrapper}>
      <IdeaBoard {...props} />
      <UserList users={users} />
      <CSSTransitionGroup
        transitionName={{ appear: styles.appear, appearActive: styles.appearActive }}
        transitionAppear
        transitionAppearTimeout={700}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div className="ui stackable grid basic attached secondary center aligned segment">
          <div className="thirteen wide column">
            <IdeaSubmissionForm {...props} showActionItem={showActionItem} />
          </div>
          <div className="three wide right aligned column">
            { isFacilitator &&
              <StageProgressionButton
                {...props}
                config={progressionConfig}
                buttonDisabled={wereActionItemsSubmitted()}
              />
            }
          </div>
          <p className={styles.poweredBy}>
            Built by <a href="http://www.stridenyc.com/">Stride Consulting</a> and Open Source Badasses
          </p>
        </div>
      </CSSTransitionGroup>
      <DoorChime users={users} />
    </section>
  )
}

Room.defaultProps = {
  currentUser: { is_facilitator: false },
}

Room.propTypes = {
  currentUser: AppPropTypes.user,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: React.PropTypes.string.isRequired,
  users: AppPropTypes.users.isRequired,
}

export default Room
