# FocusManager
# by using the FocusManager, you can control the remote controller

## FM can detect which key you had pressed, and then let the focus move by your direction
useage:
Initial
`
var focusManager = new FocusManager();
focusManager.addFocusItems(document);
focusManager.setStartfocus(0);
`

To navigate the focus
`
focusManager.toUP();
focusManager.toDOWN();
focusManager.toLEFT();
focusManager.toRIGHT();
`

When you want to focus currentItem
`
focusManager.clickFocus();
`