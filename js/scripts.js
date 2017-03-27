var editor = ace.edit("code-editor");
editor.getSession().setMode("ace/mode/javascript");
editor.setFontSize(20);
editor.setValue('regexp = "type_your_regular_expression_here";');
editor.clearSelection();
