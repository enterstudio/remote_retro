import React from "react"
import { spy } from "sinon"

import { RemoteRetro, isNewFacilitator } from "../../web/static/js/components/remote_retro"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, CLOSED } = STAGES

describe("RemoteRetro component", () => {
  const mockRetroChannel = {}
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    presences: [],
    ideas: [],
    stage: IDEA_GENERATION,
    userToken: "",
  }

  context("when the component mounts", () => {
    it("triggers a hotjar event, passing the stage", () => {
      const hotjarSpy = spy(global, "hj")

      mountWithConnectedSubcomponents(
        <RemoteRetro {...defaultProps} stage={CLOSED} />
      )

      expect(hotjarSpy.calledWith("trigger", CLOSED)).to.eql(true)
      hotjarSpy.restore()
    })
  })
})

describe("isNewFacilitator", () => {
  const stubPrevCurrentUser = {
    is_facilitator: false,
  }
  const stubPrevFacilitator = {
    is_facilitator: true,
  }
  const stubCurrentUser = {
    is_facilitator: false,
  }
  const stubCurrentFacilitator = {
    is_facilitator: true,
  }

  context("when the currentUser is not the facilitator", () => {
    it("returns false", () => {
      expect(isNewFacilitator(stubPrevCurrentUser, stubCurrentUser)).to.be.false
    })
  })

  context("when the currentUser is the new facilitator", () => {
    it("returns true", () => {
      expect(isNewFacilitator(stubPrevCurrentUser, stubCurrentFacilitator)).to.be.true
    })
  })

  context("when the currentUser was previously the facilitator", () => {
    it("returns false", () => {
      expect(isNewFacilitator(stubPrevFacilitator, stubCurrentFacilitator)).to.be.false
    })
  })
})

