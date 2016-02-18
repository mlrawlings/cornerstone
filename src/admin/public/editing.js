var Editor = {
  cache:{},
  editing:null,
  editableElements:[],
  getEditable:(element) => {
    var cached
      , id = element.id
  
    if(!id) {
      id = element.id = 'cms-'+Math.random();
    } else if(cached = Editor.cache[element.id]) {
      return cached 
    }
  
    var props = JSON.parse(element.getAttribute('data-cms-editable'))
    var list = []

    if(props) {
      list.push({
        id,
        element,
        props:Object.keys(props),
        options:props
      })
    }
  
    if(element.parentNode != document.body) {
      list = list.concat(Editor.getEditable(element.parentNode))
    }
  
    Editor.cache[element.id] = list
  
    return list
  },
  edit:(element, prop) => {
    alert(element.id + ' ' + prop);
  },
  init:() => {
    document.addEventListener('mouseover', (e) => {
      if(Menu.isOpen) return;
      Editor.editableElements = Editor.getEditable(e.target);
    }, true);
    
    document.addEventListener('click', e => {
      if(!Menu.isOpen) return;
      Editor.editableElements = Editor.getEditable(e.target);
      e.preventDefault();
    }, true);
    
    document.addEventListener('click', e => {
      if(Menu.isOpen) return;
      if(!Editor.editableElements.length) return;
      var target = Editor.editableElements[0]
      Editor.edit(target.element, target.props[0]);
      e.preventDefault();
    });
  }
}

var Menu = {
  isOpen:false,
  props: {
    'text':{ icon:'edit', label:'text' },
    'background-image':{ icon:'image', label:'background image' },
    'src':{ icon:'image', label:'image' },
    'href':{ icon:'link', label:'link destination' }
  },
  show:() => {
    if(Editor.editableElements.length) {
      Menu.node.innerHTML = Editor.editableElements.map(element => {
        return element.props.map(prop => {
          return Menu.createItem(element.id, prop); 
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
  createItem:(id, prop) => {
  	console.log(prop)
    return `<div class="cms-menu-item" data-id="${id}" data-prop="${prop}">
      <i class="material-icons">${Menu.props[prop].icon}</i>
      <span>Edit ${Menu.props[prop].label}</span>
    </div>`;
  },
  getItem:(target) => {
    while(target != Menu.node && !target.matches('.cms-menu-item')) {
      target = target.parentNode; 
    }
    
    return target != Menu.node && {
      item:target,
      element:document.getElementById(target.getAttribute('data-id')),
      prop:target.getAttribute('data-prop')
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
        Editor.edit(item.element, item.prop);
      }
    });
  }
}

var Highlight = {
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

Editor.init();
Menu.init();
Highlight.init();