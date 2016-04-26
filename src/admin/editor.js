var editableTypes = require('../../generated/editable')

var Editor = module.exports = {
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
  edit:(element, prop, action) => {
    var editable = editableTypes[prop]
    var action = editable.actions[action || Object.keys(editable.actions)[0]]
    var value = editable.parse(element)
    var options = Editor.cache[element.id][0].options[prop]

    Editor.editing = element
    action.fn(element, value, options, Editor.update(element, editable, options))

  },
  update:(element, editable, options) => {
    return (value) => {
      if(value) {
        editable.render({}, value, options)
        //TODO: apply to element
      }
      Editor.editing = null
    }
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

var Menu = require('./menu')