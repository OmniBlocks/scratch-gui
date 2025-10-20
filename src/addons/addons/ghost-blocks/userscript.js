export default async function ({ addon, console }) {
  let ScratchBlocks, workspace, vm;
  
  // Add error handling for asynchronous calls
  try {
    ScratchBlocks = await addon.tab.traps.getBlockly();
    workspace = addon.tab.traps.getWorkspace();
    vm = addon.tab.traps.vm;
  } catch (e) {
    console.error('Failed to initialize ghost blocks addon:', e);
    return; // Exit if we can't get required dependencies
  }
  
  let ghostContainer = null;
  let currentDraggedBlockId = null;
  let originalPosition = null;
  
  // Create ghost element from a block
  const createGhost = (block) => {
    try {
      // Get the block's SVG root element
      const blockSvg = block.getSvgRoot();
      if (!blockSvg) return null;
      
      // Clone the SVG element
      const clonedSvg = blockSvg.cloneNode(true);
      
      // Create container for the ghost (HTML div element)
      const container = document.createElement('div');
      container.className = 'sa-ghost-block-container';
      container.appendChild(clonedSvg);
      
      // Get the block's position before it moves to drag surface
      const position = block.getRelativeToSurfaceXY();
      originalPosition = position;
      
      // Position the ghost at the original location
      // Convert workspace coordinates to screen coordinates
      const workspaceMetrics = workspace.getMetrics();
      const scale = workspace.scale;
      const scrollX = workspaceMetrics.viewLeft;
      const scrollY = workspaceMetrics.viewTop;
      
      const screenX = (position.x - scrollX) * scale;
      const screenY = (position.y - scrollY) * scale;
      
      container.style.left = screenX + 'px';
      container.style.top = screenY + 'px';
      container.style.transform = `scale(${scale})`;
      container.style.transformOrigin = '0 0';
      
      return container;
    } catch (e) {
      console.error('Failed to create ghost block:', e);
      return null;
    }
  };
  
  // Remove ghost element - Fixed implementation
  const removeGhost = () => {
    if (ghostContainer && ghostContainer.parentNode) {
      ghostContainer.parentNode.removeChild(ghostContainer);
    }
    ghostContainer = null;
    currentDraggedBlockId = null;
    originalPosition = null;
  };
  
  // Hook into Blockly's drag start method
  const originalStartDraggingBlock = ScratchBlocks.Gesture.prototype.startDraggingBlock_;
  ScratchBlocks.Gesture.prototype.startDraggingBlock_ = function (...args) {
    const block = this.targetBlock_;
    
    // Don't create ghost for blocks from flyout or already duplicating
    if (!this.flyout_ && !this.shouldDuplicateOnDrag_ && block && !addon.self.disabled) {
      try {
        currentDraggedBlockId = block.id;
        ghostContainer = createGhost(block);
        
        if (ghostContainer) {
          // Fixed: Insert ghost into the injection div instead of SVG canvas
          const injectionDiv = workspace.getInjectionDiv();
          if (injectionDiv) {
            injectionDiv.appendChild(ghostContainer);
          }
        }
      } catch (e) {
        console.error('Failed to create ghost block:', e);
      }
    }
    
    return originalStartDraggingBlock.call(this, ...args);
  };
  
  // Listen to VM events for drag end
  const handleBlockDragEnd = (blocks, topBlockId) => {
    if (currentDraggedBlockId) {
      removeGhost();
    }
  };
  
  // Listen to workspace changes to detect when blocks move
  const handleWorkspaceChange = (event) => {
    if (addon.self.disabled) return;
    
    // Update ghost position if workspace is scrolled/zoomed while dragging
    if (ghostContainer && originalPosition && event.type === ScratchBlocks.Events.VIEWPORT_CHANGE) {
      try {
        const workspaceMetrics = workspace.getMetrics();
        const scale = workspace.scale;
        const scrollX = workspaceMetrics.viewLeft;
        const scrollY = workspaceMetrics.viewTop;
        
        const screenX = (originalPosition.x - scrollX) * scale;
        const screenY = (originalPosition.y - scrollY) * scale;
        
        ghostContainer.style.left = screenX + 'px';
        ghostContainer.style.top = screenY + 'px';
        ghostContainer.style.transform = `scale(${scale})`;
      } catch (e) {
        console.error('Failed to update ghost position:', e);
      }
    }
  };
  
  // Settings change handler
  const handleSettingsChange = () => {
    if (ghostContainer) {
      // Opacity is handled by CSS variables, so we don't need to do anything here
      // The CSS will automatically update when the setting changes
    }
  };
  
  // Setup event listeners
  vm.addListener('BLOCK_DRAG_END', handleBlockDragEnd);
  workspace.addChangeListener(handleWorkspaceChange);
  addon.settings.addEventListener('change', handleSettingsChange);
  
  // Cleanup function
  const cleanup = () => {
    removeGhost();
    
    // Restore original method
    if (ScratchBlocks.Gesture.prototype.startDraggingBlock_ !== originalStartDraggingBlock) {
      ScratchBlocks.Gesture.prototype.startDraggingBlock_ = originalStartDraggingBlock;
    }
    
    // Remove event listeners
    vm.removeListener('BLOCK_DRAG_END', handleBlockDragEnd);
    workspace.removeChangeListener(handleWorkspaceChange);
    addon.settings.removeEventListener('change', handleSettingsChange);
  };
  
  // Listen for addon disable
  addon.self.addEventListener('disabled', cleanup);
  addon.self.addEventListener('reenabled', () => {
    // Re-setup is handled automatically when the addon is re-enabled
  });
}