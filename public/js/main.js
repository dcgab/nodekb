$(document).ready(function() {
  $('.delete-article').on('click', function(e) {
    $target = $(e.target);
    const id = $target.data('id');
    $.ajax({
      type: 'DELETE',
      url: '/articles/'+id,
      success: function(res) {
        alert('Deleting Article');
        window.location.href = '/';
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});