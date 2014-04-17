class TaskSerializer < ActiveModel::Serializer
  attributes :id,:name,:description,:completed
end
