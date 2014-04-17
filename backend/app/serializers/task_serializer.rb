class TaskSerializer < ActiveModel::Serializer
  attributes :id,:name,:description,:completed,:parent_id
  has_many :tasks
  embed :ids
end
