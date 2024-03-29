class TasksController < ApplicationController
	def permitted_params(params)
	  params.require(:task).permit(:name, :description,
	   :completed, :parent_id, :start_time, :end_time)
	end
	def index
		if params.has_key? :ids
			@tasks=Task.find params[:ids]
		else
			@tasks=Task.where parent_id: nil
		end
		render json: @tasks
	end
	def show
		@task=Task.find params[:id]
		render json: @task
	end
	def create
		@task=Task.create permitted_params params
		if @task
			render json: @task,status: :ok
		else
			render json: nil,status: :unacceptable
		end
	end
	def update
		@task=Task.find params[:id]
		if @task.update_attributes permitted_params(params)
			render json: @task,status: :ok
		else
			render json: nil,status: :error
		end
	end
	def destroy
		@task=Task.find params[:id]
		if @task.destroy
			render json: nil,status: :ok
		else
			render json: nil,status: :error
		end
	end
end
