# frozen_string_literal: true

class ActivityPub::UndoEmojiReactSerializer < ActivityPub::Serializer
  attributes :id, :type, :actor

  has_one :object, serializer: ActivityPub::EmojiReactSerializer

  def id
    [ActivityPub::TagManager.instance.uri_for(object.account), '#emoji_reacts/', object.id, '/undo'].join
  end

  def type
    'Undo'
  end

  def actor
    ActivityPub::TagManager.instance.uri_for(object.account)
  end
end
