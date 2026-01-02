/**
 * Recorded Actions Playback Tests for OmniBlocks
 * Plays back pre-recorded user interactions to detect regressions
 */

const { test, expect } = require('@playwright/test');
const { ErrorDetector } = require('./utils/error-detector');
const { VideoHandler } = require('./utils/video-handler');
const { IssueCreator } = require('./utils/issue-creator');

test.describe('Recorded Actions Playback 📹', () => {
  let errorDetector;
  let videoHandler;
  let issueCreator;

  test.beforeEach(async ({ page }) => {
    errorDetector = new ErrorDetector(page);
    issueCreator = new IssueCreator();
    
    // Navigate to OmniBlocks
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForSelector('[class*="gui_flex-wrapper"]', { timeout: 30000 });
    
    console.log('🚀 OmniBlocks loaded, starting recorded action playback...');
  });

  test.afterEach(async ({ page }, testInfo) => {
    videoHandler = new VideoHandler(testInfo);
    
    // Check for errors and create issues if found
    if (errorDetector.hasErrors()) {
      const errors = errorDetector.getErrors();
      console.log(`🚨 Found ${errors.length} error(s) during action playback`);
      
      for (const error of errors) {
        const videoPath = await videoHandler.copyVideoForIssue(`recorded-${Date.now()}`);
        await issueCreator.createErrorIssue(error, videoPath, testInfo);
      }
      
      // Fail the test if errors were found
      expect(errors.length).toBe(0);
    } else {
      console.log('✅ No JavaScript errors detected during action playback');
    }
  });

  test('Basic Project Creation Workflow 🎨', async ({ page }) => {
    console.log('📹 Playing back: Basic Project Creation');
    
    const actions = [
      { type: 'click', selector: '[class*="sprite-selector-item"]:first-child', description: 'Select default sprite' },
      { type: 'wait', duration: 1000 },
      { type: 'click', selector: '[data-id="motion"]', description: 'Open Motion blocks' },
      { type: 'wait', duration: 500 },
      { type: 'drag', from: '[data-id="motion_movesteps"]', to: '[class*="code-area"]', description: 'Drag move block' },
      { type: 'wait', duration: 1000 },
      { type: 'click', selector: '[class*="green-flag"]', description: 'Click green flag' },
      { type: 'wait', duration: 2000 }
    ];
    
    await playbackActions(page, actions, errorDetector);
  });

  test('Menu Navigation Sequence 🧭', async ({ page }) => {
    console.log('📹 Playing back: Menu Navigation');
    
    const actions = [
      { type: 'click', selector: '[class*="menu-bar"] button:has-text("File")', description: 'Open File menu' },
      { type: 'wait', duration: 500 },
      { type: 'click', selector: 'body', description: 'Close menu by clicking outside' },
      { type: 'wait', duration: 300 },
      { type: 'click', selector: '[class*="menu-bar"] button:has-text("Edit")', description: 'Open Edit menu' },
      { type: 'wait', duration: 500 },
      { type: 'click', selector: 'body', description: 'Close menu' },
      { type: 'wait', duration: 300 },
      { type: 'click', selector: '[class*="menu-bar"] button:has-text("Tutorials")', description: 'Try Tutorials menu' },
      { type: 'wait', duration: 500 }
    ];
    
    await playbackActions(page, actions, errorDetector);
  });

  test('Sprite Management Workflow 🐱', async ({ page }) => {
    console.log('📹 Playing back: Sprite Management');
    
    const actions = [
      { type: 'click', selector: '[class*="sprite-selector-item"]:first-child', description: 'Select sprite' },
      { type: 'wait', duration: 500 },
      { type: 'click', selector: '[title*="Choose a Sprite"]', description: 'Add new sprite' },
      { type: 'wait', duration: 1000 },
      { type: 'click', selector: '[class*="modal"] [class*="close-button"]', description: 'Close sprite library' },
      { type: 'wait', duration: 500 },
      { type: 'rightClick', selector: '[class*="sprite-selector-item"]:first-child', description: 'Right-click sprite' },
      { type: 'wait', duration: 500 },
      { type: 'click', selector: 'body', description: 'Close context menu' }
    ];
    
    await playbackActions(page, actions, errorDetector);
  });

  test('Block Palette Exploration 🧩', async ({ page }) => {
    console.log('📹 Playing back: Block Palette Exploration');
    
    const blockCategories = ['motion', 'looks', 'sound', 'events', 'control', 'sensing', 'operators', 'variables'];
    
    const actions = [];
    
    // Add actions to click through each block category
    for (const category of blockCategories) {
      actions.push(
        { type: 'click', selector: `[data-id="${category}"]`, description: `Open ${category} blocks` },
        { type: 'wait', duration: 800 }
      );
    }
    
    // Add some block interaction
    actions.push(
      { type: 'hover', selector: '[class*="blocklyText"]:first-child', description: 'Hover over first block' },
      { type: 'wait', duration: 500 },
      { type: 'click', selector: '[data-id="motion"]', description: 'Return to motion blocks' },
      { type: 'wait', duration: 500 }
    );
    
    await playbackActions(page, actions, errorDetector);
  });

  test('Stage Interaction Sequence 🎭', async ({ page }) => {
    console.log('📹 Playing back: Stage Interaction');
    
    const actions = [
      { type: 'click', selector: '[class*="stage-wrapper"]', description: 'Click on stage' },
      { type: 'wait', duration: 500 },
      { type: 'click', selector: '[class*="green-flag"]', description: 'Start project' },
      { type: 'wait', duration: 1000 },
      { type: 'click', selector: '[class*="stop-all"]', description: 'Stop project' },
      { type: 'wait', duration: 500 },
      { type: 'click', selector: '[class*="full-screen-button"]', description: 'Toggle fullscreen' },
      { type: 'wait', duration: 1000 },
      { type: 'key', key: 'Escape', description: 'Exit fullscreen' },
      { type: 'wait', duration: 500 }
    ];
    
    await playbackActions(page, actions, errorDetector);
  });

  test('Addon Panel Interaction 🔧', async ({ page }) => {
    console.log('📹 Playing back: Addon Panel');
    
    const actions = [
      { type: 'click', selector: '[class*="menu-bar"] button:has-text("Addons")', description: 'Open Addons menu' },
      { type: 'wait', duration: 1000 },
      { type: 'scroll', selector: '[class*="addon-settings"]', direction: 'down', description: 'Scroll addon list' },
      { type: 'wait', duration: 500 },
      { type: 'click', selector: '[class*="addon-settings"] input[type="checkbox"]:first-child', description: 'Toggle first addon' },
      { type: 'wait', duration: 1000 },
      { type: 'click', selector: '[class*="close-button"]', description: 'Close addon panel' }
    ];
    
    await playbackActions(page, actions, errorDetector);
  });
});

async function playbackActions(page, actions, errorDetector) {
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    
    try {
      console.log(`  ${i + 1}/${actions.length}: ${action.description}`);
      
      switch (action.type) {
        case 'click':
          await page.click(action.selector, { timeout: 5000 });
          break;
          
        case 'rightClick':
          await page.click(action.selector, { button: 'right', timeout: 5000 });
          break;
          
        case 'hover':
          await page.hover(action.selector, { timeout: 5000 });
          break;
          
        case 'drag':
          const source = await page.locator(action.from).first();
          const target = await page.locator(action.to).first();
          await source.dragTo(target);
          break;
          
        case 'key':
          await page.keyboard.press(action.key);
          break;
          
        case 'scroll':
          await page.locator(action.selector).first().scroll({ 
            direction: action.direction === 'down' ? 'down' : 'up' 
          });
          break;
          
        case 'wait':
          await page.waitForTimeout(action.duration);
          break;
          
        default:
          console.log(`⚠️ Unknown action type: ${action.type}`);
      }
      
      // Log the action
      errorDetector.logAction({
        type: action.type,
        target: action.selector || action.description,
        details: { 
          step: i + 1, 
          totalSteps: actions.length,
          description: action.description 
        }
      });
      
    } catch (error) {
      console.log(`⚠️ Action failed: ${action.description} - ${error.message}`);
      
      // Log failed action
      errorDetector.logAction({
        type: 'failed_action',
        target: action.selector || action.description,
        details: { 
          error: error.message,
          step: i + 1,
          description: action.description 
        }
      });
      
      // Continue with next action instead of failing entire test
      continue;
    }
  }
  
  console.log('✅ Action playback completed');
}
