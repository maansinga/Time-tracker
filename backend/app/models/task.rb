class Task < ActiveRecord::Base
	belongs_to :task,foreign_key: :parent_id
	has_many :tasks,foreign_key: :parent_id,dependent: :destroy
end
