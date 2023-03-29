/**
 * Tab 'Categories' expand/close effect.
 */
const childPrefix = 'l_';
const parentPrefix = 'h_';
const collapse = $('.collapse');

export function categoryCollapse() {
  /* close up top-category */
  collapse.on('hide.bs.collapse', function () {
    /* Bootstrap collapse events. */ const parentId =
      parentPrefix + $(this).attr('id').substring(childPrefix.length);
    if (parentId) {
      $(`#${parentId} .iconfont.icon-FolderOpen-1`).attr(
        'class',
        'iconfont icon-folder'
      );
      $(`#${parentId} i.ifrot`).addClass('rotate');
      $(`#${parentId}`).removeClass('hide-border-bottom');
    }
  });

  /* expand the top category */
  collapse.on('show.bs.collapse', function () {
    const parentId =
      parentPrefix + $(this).attr('id').substring(childPrefix.length);
    if (parentId) {
      $(`#${parentId} .iconfont.icon-folder`).attr(
        'class',
        'iconfont icon-FolderOpen-1'
      );
      $(`#${parentId} i.ifrot`).removeClass('rotate');
      $(`#${parentId}`).addClass('hide-border-bottom');
    }
  });
}
