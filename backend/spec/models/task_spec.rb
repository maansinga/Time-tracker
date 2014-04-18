require 'spec_helper'

describe Task do
	it {should respond_to :id}	
	it {should respond_to :name}	
	it {should respond_to :description}	
	it {should respond_to :completed}	
	it {should respond_to :start_time}	
	it {should respond_to :end_time}

	it 'should have dependent destroy on its children' do
		parent=Task.create :name=> 'json',:description=> 'nothing'
		child=Task.create name: 'json',description: 'nothing',parent_id: parent.id
		parent.id.should_not eq nil
		child.id.should_not eq nil
		expect{
			parent.destroy
		}.to change(Task,:count).by(-2)
	end

	it 'should not let child destroy parent due to dependency' do
		parent=Task.create :name=> 'json',:description=> 'nothing'
		child=Task.create name: 'json',description: 'nothing',parent_id: parent.id
		parent.id.should_not eq nil
		child.id.should_not eq nil
		expect{
			child.destroy
		}.to change(Task,:count).by(-1)
	end
end