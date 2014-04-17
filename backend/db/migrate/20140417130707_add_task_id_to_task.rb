class AddTaskIdToTask < ActiveRecord::Migration
  def change
    add_reference :tasks, :task, index: true
  end
end
