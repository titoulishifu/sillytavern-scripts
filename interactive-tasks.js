// ==UserScript==
// @name         MVU Status Bar Task Interaction
// @version      1.2
// @description  Adds click-to-input functionality for the task lists in the MVU status bar using robust event delegation.
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
            // Dispatch an 'input' event to make sure the UI updates
            sendTextArea.dispatchEvent(new Event('input', { bubbles: true }));
            sendTextArea.focus();
        }
    }

    // This function sets up the event listeners using event delegation
    function setupTaskListeners() {
        const pendingTasksList = document.getElementById('tasks-pending');
        const completedTasksList = document.getElementById('tasks-completed');

        // Listener for uncompleted tasks
        if (pendingTasksList && !pendingTasksList.dataset.listenerAttached) {
            pendingTasksList.dataset.listenerAttached = 'true'; // Mark as listener attached
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
            console.log("MVU Interaction: Listener attached to PENDING tasks.");
        }

        // Listener for completed tasks
        if (completedTasksList && !completedTasksList.dataset.listenerAttached) {
            completedTasksList.dataset.listenerAttached = 'true'; // Mark as listener attached
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
            console.log("MVU Interaction: Listener attached to COMPLETED tasks.");
        }
    }

    // Use a MutationObserver to watch for when the status bar is added to the DOM or re-rendered.
    // This is more robust than a one-time check or an interval.
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // Check if nodes were added
            if (mutation.addedNodes.length) {
                // Run the setup function to check for the lists and attach listeners if needed
                setupTaskListeners();
            }
        }
    });

    // Start observing the entire document for changes to its structure.
    observer.observe(document.body, {
        childList: true, // Observe direct children being added or removed
        subtree: true    // Observe all descendants
    });

    // Also run it once on script start, in case the elements are already there.
    setupTaskListeners();

})();
