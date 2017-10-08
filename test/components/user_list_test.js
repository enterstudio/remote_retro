import React from "react"
import { shallow, mount } from "enzyme"

import UserList from "../../web/static/js/components/user_list"
import UserListItem from "../../web/static/js/components/user_list_item"

describe("passed an array of users", () => {
  const users = [{
    given_name: "treezy",
    online_at: 803,
    picture: "http://herpderp.com",
  }, {
    given_name: "zander",
    online_at: 801,
    picture: "http://herpderp.com",
  }]

  it("is renders a list item for each user", () => {
    const wrapper = shallow(<UserList stage="voting" users={users} />)
    expect(wrapper.find(UserListItem)).to.have.length(2)
  })

  it("sorts the users by their arrival in the room, ascending", () => {
    const wrapper = mount(<UserList stage="voting" users={users} />)
    expect(wrapper.text()).to.match(/zandertreezy/i)
  })
})
