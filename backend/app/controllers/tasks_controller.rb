class TasksController < ApplicationController
	def permitted_params(params)
	  params.require(:task).permit(:name, :description)
	end
	def index
		@tasks=Task.all
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
end
