defmodule RemoteRetro.Idea do
  use RemoteRetro.Web, :model

  @derive {Poison.Encoder, except: [:__meta__]}
  schema "ideas" do
    field :category, :string
    field :body, :string
    field :vote_count, :integer, default: 0

    belongs_to :retro, RemoteRetro.Retro, type: Ecto.UUID
    belongs_to :user, RemoteRetro.User
    has_many :vote, RemoteRetro.Vote

    timestamps(type: :utc_datetime)
  end

  @required_fields [:category, :body, :retro_id, :user_id, :vote_count]

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_fields)
    |> validate_required(@required_fields)
  end
end
