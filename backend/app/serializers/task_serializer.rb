class TaskSerializer < ActiveModel::Serializer
  attributes :id,:name,:description,:completed,:task_id
  has_many :tasks
end
