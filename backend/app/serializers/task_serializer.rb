class TaskSerializer < ActiveModel::Serializer
  attributes :id,:name,:description,:completed,:parent_id,:start_time,:end_time
  has_many :tasks
  embed :ids
end
