/**
 * Random Click Spam Tests for OmniBlocks
 * Performs random interactions across the interface to detect errors
 */

const { test, expect } = require('@playwright/test');
const { ErrorDetector } = require('./utils/error-detector');
const { VideoHandler } = require('./utils/video-handler');
const { IssueCreator } = require('./utils/issue-creator');

test.describe('Random Click Spam Tests 🎯', () => {
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
    
    console.log('🚀 OmniBlocks loaded, starting random click test...');
  });

  test.afterEach(async ({ page }, testInfo) => {
    videoHandler = new VideoHandler(testInfo);
    
    // Check for errors and create issues if found
    if (errorDetector.hasErrors()) {
      const errors = errorDetector.getErrors();
      console.log(`🚨 Found ${errors.length} error(s) during random clicking`);
      
      for (const error of errors) {
        const videoPath = await videoHandler.copyVideoForIssue(`random-${Date.now()}`);
        await issueCreator.createErrorIssue(error, videoPath, testInfo);
      }
      
      // Fail the test if errors were found
      expect(errors.length).toBe(0);
    } else {
      console.log('✅ No JavaScript errors detected during random clicking');
    }
  });

  test('Chaos Mode: 100 Random Clicks 🎪', async ({ page }) => {
    const CLICK_COUNT = 100;
    const CLICK_DELAY = 100; // ms between clicks
    
    console.log(`🎪 Starting chaos mode: ${CLICK_COUNT} random clicks`);
    
    for (let i = 0; i < CLICK_COUNT; i++) {
      try {
        await performRandomClick(page, errorDetector, i + 1);
        await page.waitForTimeout(CLICK_DELAY);
        
        // Log progress every 10 clicks
        if ((i + 1) % 10 === 0) {
          console.log(`🎯 Completed ${i + 1}/${CLICK_COUNT} random clicks`);
        }
        
      } catch (error) {
        console.log(`⚠️ Click ${i + 1} failed: ${error.message}`);
        // Continue with next click even if one fails
      }
    }
    
    console.log('🎪 Chaos mode completed!');
  });

  test('Focused Spam: UI Components 🎨', async ({ page }) => {
    const components = [
      { name: 'Menu Bar', selector: '[class*="menu-bar"]' },
      { name: 'Sprite List', selector: '[class*="sprite-selector"]' },
      { name: 'Block Palette', selector: '[class*="blocks-wrapper"]' },
      { name: 'Stage', selector: '[class*="stage-wrapper"]' },
      { name: 'Code Area', selector: '[class*="code-area"]' }
    ];
    
    for (const component of components) {
      console.log(`🎨 Spam clicking ${component.name}...`);
      
      try {
        const element = await page.locator(component.selector).first();
        if (await element.isVisible()) {
          await spamClickArea(page, element, errorDetector, 20);
        } else {
          console.log(`⚠️ ${component.name} not visible, skipping`);
        }
      } catch (error) {
        console.log(`⚠️ Failed to spam ${component.name}: ${error.message}`);
      }
      
      await page.waitForTimeout(500); // Brief pause between components
    }
  });

  test('Rapid Fire: Quick Succession Clicks ⚡', async ({ page }) => {
    console.log('⚡ Starting rapid fire test...');
    
    // Get all clickable elements
    const clickableElements = await page.locator('button, [role="button"], a, [class*="clickable"]').all();
    
    if (clickableElements.length === 0) {
      console.log('⚠️ No clickable elements found');
      return;
    }
    
    // Rapid fire clicks on random elements
    for (let i = 0; i < 50; i++) {
      const randomElement = clickableElements[Math.floor(Math.random() * clickableElements.length)];
      
      try {
        if (await randomElement.isVisible()) {
          await randomElement.click({ timeout: 1000 });
          
          errorDetector.logAction({
            type: 'rapid_click',
            target: await getElementDescription(randomElement),
            details: { iteration: i + 1 }
          });
        }
      } catch (error) {
        // Ignore click failures in rapid fire mode
      }
      
      await page.waitForTimeout(50); // Very short delay
    }
    
    console.log('⚡ Rapid fire completed!');
  });
});

async function performRandomClick(page, errorDetector, clickNumber) {
  // Get viewport dimensions
  const viewport = page.viewportSize();
  
  // Generate random coordinates
  const x = Math.floor(Math.random() * viewport.width);
  const y = Math.floor(Math.random() * viewport.height);
  
  // Try to find element at coordinates
  const element = await page.locator(`*`).first();
  
  try {
    // Click at random coordinates
    await page.mouse.click(x, y);
    
    // Log the action
    errorDetector.logAction({
      type: 'random_click',
      target: `coordinates(${x}, ${y})`,
      details: { clickNumber, x, y }
    });
    
  } catch (error) {
    // Some clicks might fail (e.g., clicking on non-interactive elements)
    // This is expected behavior in random clicking
  }
}

async function spamClickArea(page, element, errorDetector, clickCount) {
  const boundingBox = await element.boundingBox();
  if (!boundingBox) return;
  
  for (let i = 0; i < clickCount; i++) {
    // Random position within the element
    const x = boundingBox.x + Math.random() * boundingBox.width;
    const y = boundingBox.y + Math.random() * boundingBox.height;
    
    try {
      await page.mouse.click(x, y);
      
      errorDetector.logAction({
        type: 'area_spam_click',
        target: await getElementDescription(element),
        details: { iteration: i + 1, x, y }
      });
      
    } catch (error) {
      // Continue even if individual clicks fail
    }
    
    await page.waitForTimeout(100);
  }
}

async function getElementDescription(element) {
  try {
    const tagName = await element.evaluate(el => el.tagName.toLowerCase());
    const className = await element.getAttribute('class') || '';
    const id = await element.getAttribute('id') || '';
    
    return `${tagName}${id ? `#${id}` : ''}${className ? `.${className.split(' ')[0]}` : ''}`;
  } catch {
    return 'unknown-element';
  }
}
