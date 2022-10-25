function viewCategories(fields) {
	fetch('/api/categories')
	  .then(showResponse)
		.catch(showResponse);
}

function createCategory(fields) {
	fetch('/api/categories', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
	  .then(showResponse)
		.catch(showResponse);
}

function viewCategory(fields) {
	fetch(`/api/categories/${fields.name}`)
	  .then(showResponse)
		.catch(showResponse);
}

function deleteCategory(fields) {
	fetch(`/api/categories/${fields.name}`, {method: 'DELETE'})
	  .then(showResponse)
		.catch(showResponse);
}

function addCategoryMember(fields) {
	fetch(`/api/categories/${fields.name}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
	  .then(showResponse)
		.catch(showResponse);
}

function deleteCategoryMember(fields) {
	fetch(`api/categories/${fields.name}/${fields.member}`, {method: 'DELETE'})
	  .then(showResponse)
		.catch(showResponse);
}