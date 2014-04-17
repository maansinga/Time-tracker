class Task < ActiveRecord::Base
	belongs_to :task
	has_many :tasks
end
