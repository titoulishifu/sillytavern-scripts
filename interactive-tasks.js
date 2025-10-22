// ==UserScript==
// @name         MVU Status Bar Task Interaction
// @version      1.1
// @description  Adds click-to-input functionality for the task lists in the MVU status bar.
// @author       You
// @match        */*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to set the text in the SillyTavern input box
    function setInputText(text) {
        const sendTextArea = document.getElementById('send_textarea');
        if (sendTextArea) {
            sendTextArea.value = text;
            // Dispatch an 'input' event to make sure the UI updates (e.g., character count)
            sendTextArea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // This function sets up the event listeners
    function setupTaskListeners() {
        // Use a more robust selector to ensure we are targeting the status bar's lists
        const statusBar = document.querySelector('details > summary:first-child > span:first-child');
        
        // Only proceed if we are reasonably sure this is the correct status bar
        if (!statusBar || !statusBar.textContent.includes('管家工作日志')) {
            return;
        }

        const pendingTasksList = document.getElementById('tasks-pending');
        const completedTasksList = document.getElementById('tasks-completed');

        // Listener for uncompleted tasks
        if (pendingTasksList) {
            pendingTasksList.addEventListener('click', (event) => {
                const taskItem = event.target.closest('li');
                if (taskItem) {
                    const taskText = taskItem.textContent.trim();
                    if (taskText && taskText !== '—') {
                        const newText = `{{user}}完成了任务：${taskText}`;
                        setInputText(newText);
                    }
                }
            });
        }

        // Listener for completed tasks
        if (completedTasksList) {
            completedTasksList.addEventListener('click', (event) => {
                const taskItem = event.target.closest('li');
                if (taskItem) {
                    const taskText = taskItem.textContent.trim();
                     if (taskText && taskText !== '—') {
                        const newText = `{{user}}假装完成了任务：${taskText}，但实际上并没有完成。`;
                        setInputText(newText);
                    }
                }
            });
        }
    }

    // We need to wait for the status bar to be loaded into the DOM.
    // A simple way is to use a MutationObserver to watch for the element to appear.
    const observer = new MutationObserver((mutations, obs) => {
        // We check for 'tasks-pending' as it's a unique ID within your status bar.
        if (document.getElementById('tasks-pending')) {
            console.log("MVU Status Bar detected. Attaching task listeners.");
            setupTaskListeners();
            obs.disconnect(); // Stop observing once we've found it and set up the listeners.
        }
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();