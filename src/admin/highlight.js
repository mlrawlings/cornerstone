var Highlight = module.exports = {
  show:(element) => {
    element.offsetParent.appendChild(Highlight.node);
    Highlight.node.style.top = element.offsetTop + 'px';
    Highlight.node.style.left = element.offsetLeft + 'px';
    Highlight.node.style.width = element.offsetWidth + 'px';
    Highlight.node.style.height = element.offsetHeight + 'px';
    Highlight.node.style.display = 'block';
    if(Editor.editing == element) {
      Highlight.node.classList.add('editing');
    } else {
      Highlight.node.classList.remove('editing');
    }
  },
  hide:() => {
    Highlight.node.style.display = 'none';
    Highlight.node.classList.remove('active');
  },
  toggle:() => {
    if(Menu.isOpen) return;
    if(Editor.editableElements.length) {
      Highlight.show(Editor.editableElements[0].element);
    } else {
      Highlight.hide();
    }
  },
  init:() => {
    Highlight.node = document.createElement('div');
    Highlight.node.setAttribute('id', 'cms-highlight');
    document.body.appendChild(Highlight.node);
    
    document.addEventListener('click', Highlight.toggle);
    document.addEventListener('mouseover', Highlight.toggle);
    
    document.addEventListener('mouseout', e => {
      if(Menu.isOpen) return;
      Highlight.hide();
    });
    
    document.addEventListener('mousedown', e => {
      Highlight.node.classList.add('active');
    });

    document.addEventListener('mouseup', e => {
      Highlight.node.classList.remove('active');
    });
  }
}

var Menu = require('./menu')
var Editor = require('./editor')