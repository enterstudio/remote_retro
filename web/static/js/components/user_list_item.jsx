import React from "react"
import { connect } from "react-redux"
import { voteMax } from "../configs/retro_configs"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list_item.css"
import AnimatedEllipsis from "./animated_ellipsis"

export const UserListItem = ({ user, votes, stage }) => {
  let givenName = user.given_name
  const imgSrc = user.picture.replace("sz=50", "sz=200")
  const votesByUser = votes.filter(vote => vote.user_id === user.id).length
  const allVotesIn = votesByUser >= voteMax

  if (user.is_facilitator) givenName += " (Facilitator)"

  return (
    <li className={`item ${styles.wrapper}`}>
      <img className={styles.picture} src={imgSrc} alt={givenName} />
      <p data-hj-masked>{givenName}</p>
      { stage !== "voting" && <AnimatedEllipsis animated={user.is_typing} /> }
      { stage === "voting" &&
        <p className={styles.votingStatusPlaceholder}>
          { allVotesIn && <span className="ui transition fade in">All Votes In</span> }
        </p>
      }
    </li>
  )
}

UserListItem.propTypes = {
  user: AppPropTypes.user.isRequired,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

const mapStateToProps = ({ votes, stage }) => ({ votes, stage })

export default connect(
  mapStateToProps
)(UserListItem)
