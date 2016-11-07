'use strict'

$(document).ready(function() {

const todolist_element = $("#todo-list");
const search = $("#searchbox").val();

const drawList = function() {
	$.ajax({
		url : "/todos",
		type : "get",
		dataType : "json",
		data : {
			searchText : search
		},
		success : function(todos) {
			$("#todo-list").html("");
			const searchText = $("#searchbox").val();
			const filteredList = todos.filter(function(todoItem) {
					if (!searchText) {
						return true;
					}
					if (todoItem.message.toLowerCase().indexOf(searchText.toLowerCase())>=0) {
						return true;
					}
					return false;
				});

				filteredList.forEach(function(todoItem) {
					const li = $("<li><span>"+todoItem.message+"</span><input type='checkbox' /> <button name='"+
          todoItem.id+"' class='delete'>Delete</button>");
					const input = li.find("input");
					input.prop("checked", todoItem.completed)
					input.on("change", function() {
						todoItem.completed = input.prop("checked");
					});
					$("#todo-list").append(li);

				});
		},
		error : function (data) {
			alert("Error");
		}
	});
};

const addtodo = function () {
	const val = $('#addmsg').val();
    	$('#addmsg').val('');

   	$.ajax({
        	url : "/todos",
        	type : 'post',
        	dataType : 'json',
        	data : JSON.stringify ({
           		message : val,
            		completed : false
       		}),

		success : function(todos) {
			const li = $("<li><span>"+todos.message+"</span><input type='checkbox'/> <button name='"+todos.id+"' class='delete'>Delete</button>");
			const input = li.find("input");
			input.prop("checked", todos.completed)
			input.on("change", function() {
				todos.completed = input.prop("checked");
			});
			$("#todo-list").append(li);
		},

       		error : function(data) {
            		alert("Error");
        }
    });
};

const deletetodo = function (todoItemID) {

	$.ajax({
        	url : "/todos/" + todoItemID,
        	type : 'delete',

		success : function(data) {
            		drawList();
			setTimeout(function(){ alert(data); }, 400);
        	},
        	error : function(data) {
            		alert("Error");
        	}
    	});

};

$(document).on('click', '.delete', function () {
	deletetodo(this.name);
});


$("#add").on("click", function () {
	addtodo();
});

$("#searchbutton").on("click", function () {
	drawList();
});

drawList();
});
