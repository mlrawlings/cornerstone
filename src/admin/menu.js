var editableTypes = require('../../generated/editable')

var Menu = module.exports = {
  isOpen:false,
  show:() => {
    if(Editor.editableElements.length) {
      Menu.node.innerHTML = Editor.editableElements.map(element => {
        return element.props.map(prop => {
          var actions = editableTypes[prop].actions
          return Object.keys(actions).map(action => {
            return Menu.createItem(element.id, prop, action, actions[action]); 
          }).join('');
        }).join('');
      }).join('');
      Menu.node.style.display = 'block';
    }
  },
  move:(x, y, ignoreOffset) => {
    const CURSOR_X_OFFSET = ignoreOffset ? 0 : 12;
    const CURSOR_Y_OFFSET = ignoreOffset ? 0 : 24;
  
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
  
    var pY = (y + CURSOR_Y_OFFSET + scrollTop) + 'px';
    var pX = (x + CURSOR_X_OFFSET + scrollLeft) + 'px';
  
    Menu.node.style.webkitTransform = `translate(${pX}, ${pY})`;
  },
  hide:() => {
    Menu.node.style.display = 'none';
  },
  open:() => {
    Menu.isOpen = true;
    Highlight.hide();
    Menu.node.classList.add('open');
  },
  close:() => {
    Menu.isOpen = false;
    Menu.hide();
    Menu.node.classList.remove('open');
  },
  createItem:(id, prop, action, data) => {
    return `<div class="cms-menu-item" data-id="${id}" data-prop="${prop}" data-action="${action}">
      <i class="material-icons">${data.icon}</i>
      <span>${data.label}</span>
    </div>`;
  },
  getItem:(target) => {
    while(target != Menu.node && !target.matches('.cms-menu-item')) {
      target = target.parentNode; 
    }
    
    return target != Menu.node && {
      item:target,
      element:document.getElementById(target.getAttribute('data-id')),
      prop:target.getAttribute('data-prop'),
      action:target.getAttribute('data-action')
    }
  },
  init:() => {
    Menu.node = document.createElement('div');
    Menu.node.setAttribute('id', 'cms-menu');
    document.body.appendChild(Menu.node);
    
    var requestingMove = false;

    document.addEventListener('mousemove', e => {
      if(Menu.isOpen) return;
      if(requestingMove) return;
      
      requestAnimationFrame(() => {
        if(Editor.editableElements.length) {
          Menu.move(e.x, e.y);
        }
        requestingMove = false;
      });
      
      requestingMove = true;
    });
    
    document.addEventListener('mouseover', e => {
      if(Menu.isOpen) return;
      if(!Editor.editableElements.length) return;
      Menu.show();
    });
    
    document.addEventListener('mouseout', e => {
      if(Menu.isOpen) return;
      Menu.hide();
    });
    
    document.addEventListener('contextmenu', e => {
      if(Menu.isOpen) return;
      if(!Editor.editableElements.length) return;
      Menu.open();
      Menu.move(e.x, e.y, true);
      e.preventDefault();
    });
    
    document.addEventListener('click', e => {
      if(!Menu.isOpen) return;
      Menu.close();
      if(Editor.editableElements.length) {
        Menu.show();
      }
    });
    
    Menu.node.addEventListener('mouseover', e => {
      var item = Menu.getItem(e.target);
      if(item) {
        Highlight.show(item.element);
      } else {
        Highlight.hide(); 
      }
    });
    
    Menu.node.addEventListener('mouseout', e => {
      Highlight.hide()
    });
    
    Menu.node.addEventListener('click', e => {
      var item = Menu.getItem(e.target);
      if(item) {
        Editor.edit(item.element, item.prop, item.action);
      }
    });
  }
}

var Editor = require('./editor')
var Highlight = require('./highlight')