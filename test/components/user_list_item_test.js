import React from "react"
import { shallow, mount } from "enzyme"

import { UserListItem } from "../../web/static/js/components/user_list_item"

const defaultUserAttrs = {
  given_name: "dylan",
  online_at: 803,
  is_facilitator: false,
  is_typing: false,
  picture: "http://some/image.jpg?sz=200",
}

const defaultProps = {
  votes: [],
  stage: "idea-generation",
  user: defaultUserAttrs,
}

describe("UserListItem", () => {
  let wrapper
  let user

  describe("passed a non-facilitator user", () => {
    const nonFacilitator = { ...defaultUserAttrs, is_facilitator: false }

    it("renders a list item that does not label the user a facilitator", () => {
      const wrapper = shallow(
        <UserListItem {...defaultProps} user={nonFacilitator} />
      )
      expect(wrapper.text()).not.to.match(/facilitator/i)
    })
  })

  describe("passed a facilitator user", () => {
    const facilitator = { ...defaultUserAttrs, is_facilitator: true }

    it("renders a list item with text labeling the user facilitator", () => {
      const wrapper = shallow(
        <UserListItem {...defaultProps} user={facilitator} />
      )
      expect(wrapper.text()).to.match(/dylan \(facilitator\)/i)
    })
  })

  context("when the stage is anything but 'voting'", () => {
    context("when passed a user who *is* currently typing", () => {
      const user = { ...defaultUserAttrs, is_typing: true }

      it("renders the user with an ellipsis animation", () => {
        const wrapper = mount(
          <UserListItem
            {...defaultProps}
            user={user}
            stage="idea-generation"
          />
        )

        expect(wrapper.find("i.circle.icon")).to.have.length(3)
      })
    })

    context("when passed a user who is *not* currently typing", () => {
      const user = { ...defaultUserAttrs, is_typing: false }

      it("does not render the user with an ellipsis animation", () => {
        const wrapper = shallow(
          <UserListItem
            {...defaultProps}
            stage="idea-generation"
            user={user}
          />
        )
        expect(wrapper.find("i.circle.icon")).to.have.length(0)
      })
    })
  })

  it("changes the user's image url such that its `sz` query attribute's becomes 200", () => {
    user = { ...defaultUserAttrs, picture: "http://some/image.jpg?sz=50" }
    wrapper = shallow(<UserListItem {...defaultProps} user={user} />)
    const imageSrc = wrapper.find("img.picture").prop("src")
    expect(imageSrc).to.equal("http://some/image.jpg?sz=200")
  })

  context("when the stage is voting", () => {
    it("does not render the animated ellipsis wrapper", () => {
      const wrapper = shallow(<UserListItem {...defaultProps} stage="voting" />)
      expect(wrapper.text()).to.not.match(/animatedellipsis/i)
    })

    it("renders a voting status placeholder", () => {
      const wrapper = shallow(<UserListItem {...defaultProps} stage="voting" />)
      expect(wrapper.html()).to.contain("votingStatusPlaceholder")
    })

    context("and the given user has more than 4 votes", () => {
      const userWithFiveVotes = { ...defaultUserAttrs, id: 999 }
      const voteForUser = { user_id: 999 }
      const votes = [voteForUser, voteForUser, voteForUser, voteForUser, voteForUser]

      it("renders text indicating that the user is done voting", () => {
        const wrapper = shallow(
          <UserListItem
            user={userWithFiveVotes}
            stage="voting"
            votes={votes}
          />
        )
        expect(wrapper.text()).to.match(/all votes in/i)
      })
    })

    context("and the given user has less than 5 votes", () => {
      const userWithFourVotes = { ...defaultUserAttrs, id: 999 }
      const voteForUser = { user_id: 999 }
      const votes = [voteForUser, voteForUser, voteForUser, voteForUser]

      it("does not render text indicating that the user is done voting", () => {
        const wrapper = shallow(
          <UserListItem
            user={userWithFourVotes}
            stage="voting"
            votes={votes}
          />
        )
        expect(wrapper.text()).to.not.match(/all votes in/i)
      })
    })
  })
})
