defmodule FacilitatorHighlightsAnIdeaTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  @mock_user Application.get_env(:remote_retro, :mock_user)

  describe "when the facilitator clicks on the announcement icon for an idea" do
    setup [:persist_user_for_retro, :persist_idea_for_retro]

    @tag user: Map.put(@mock_user, "email", "hiro@protagonist.com")
    @tag idea: %Idea{category: "happy", body: "Teams worked well together"}
    test "the idea that the facilitator clicked on toggles highlighted class for everyone", %{session: facilitator_session, retro: retro} do
      idea_body = "Teams worked well together"
      participant_session = new_browser_session()

      retro_path = "/retros/#{retro.id}"
      facilitator_session = authenticate(facilitator_session) |> visit(retro_path)
      participant_session = authenticate(participant_session) |> visit(retro_path)

      idea = participant_session |> find(Query.css("li[title='#{idea_body}']"))
      refute Element.attr(idea, "class") |> String.contains?("highlighted")

      facilitator_session |> find(Query.css("li[title='#{idea_body}'] .announcement.icon")) |> Element.click
      assert Element.attr(idea, "class") |> String.contains?("highlighted")

      facilitator_session |> find(Query.css("li[title='#{idea_body}'] .ban.icon")) |> Element.click
      refute Element.attr(idea, "class") |> String.contains?("highlighted")
    end
  end

end
