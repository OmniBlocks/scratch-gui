# Boxy AI Assistant - Development Roadmap

## Current Status: v1.0 - Foundation Complete ✅

The basic addon scaffolding and character display system is complete and working.

---

## Roadmap Phases

### Phase 1: Foundation & Scaffolding ✅ COMPLETED
**Status**: Released in PR #[TBD]  
**Completed**: January 2026

#### What's Done:
- [x] Addon registration and configuration
- [x] Basic Boxy character display (SVG inline)
- [x] Drag-and-drop functionality
- [x] Text bubble system
- [x] Animation state machine foundation
- [x] CSS animations (wave, bounce, thinking)
- [x] Developer API (`window.boxyAPI`)
- [x] Comprehensive documentation
- [x] Unit tests

#### Files Created:
- `_manifest_entry.js`
- `_runtime_entry.js`
- `userscript.js` (209 lines)
- `style.css` (184 lines)
- `README.md`
- `USAGE.md`
- `VISUAL_PREVIEW.md`
- `test/unit/addons/boxy-assistant.test.js`

**Total**: ~955 lines of code + documentation

---

### Phase 2: Enhanced Animations 🔄 NEXT UP
**Target**: Q1 2026  
**Priority**: Medium

#### Goals:
Implement the full animation system to make Boxy feel alive and expressive.

#### Tasks:
- [ ] **Eye Animations**
  - [ ] Implement 48-frame "star eyes" animation sequence
  - [ ] Add blinking animation (random intervals)
  - [ ] Add "looking around" idle animation
  - [ ] Eye color changes based on state

- [ ] **Body Animations**
  - [ ] Add subtle breathing animation (idle state)
  - [ ] Create "jumping" animation for excitement
  - [ ] Add "nodding" animation for acknowledgment
  - [ ] Add "shaking head" animation for corrections

- [ ] **Arm/Hand System**
  - [ ] Design arm sprite system
  - [ ] Implement "growing arms" animation
  - [ ] Create pointing gesture (left, right, up, down)
  - [ ] Add "grabbing" animation for block manipulation
  - [ ] Add waving animation refinement

- [ ] **Expression System**
  - [ ] Happy (default)
  - [ ] Excited (star eyes)
  - [ ] Thinking (dots, neutral eyes)
  - [ ] Confused (tilted, questioning)
  - [ ] Sad (downturned mouth)
  - [ ] Celebrating (confetti particles?)

#### Files to Modify:
- `userscript.js` - Add animation frame system
- `style.css` - Add new @keyframes
- Create: `animations.js` - Dedicated animation controller

#### Testing:
- Add animation performance tests
- Test on low-end devices
- Verify no memory leaks from animations

**Estimated Effort**: 40-60 hours

---

### Phase 3: AI Integration - Local Models 🤖 PRIORITY
**Target**: Q2 2026  
**Priority**: High

#### Goals:
Integrate local AI using ONNX Runtime WebGPU for privacy-first assistance.

#### Tasks:
- [ ] **ONNX Runtime Setup**
  - [ ] Add ONNX Runtime Web dependency
  - [ ] Implement WebGPU detection and fallback
  - [ ] Test on multiple GPU vendors (NVIDIA, AMD, Intel)

- [ ] **Model Selection**
  - [ ] Research small models (< 1GB)
    - Options: Phi-2, Gemma 2B, TinyLlama
  - [ ] Quantize models for size/speed
  - [ ] Test inference performance on various devices
  - [ ] Choose best model for education use case

- [ ] **Model Loading UI**
  - [ ] Design "brain installation" interface
  - [ ] Implement download progress indicator
  - [ ] Add model compilation progress (for WebGPU)
  - [ ] Handle errors gracefully (storage, memory, etc.)
  - [ ] Cache model in IndexedDB

- [ ] **Inference System**
  - [ ] Implement streaming inference
  - [ ] Add token-by-token display in speech bubble
  - [ ] Optimize prompt engineering for education
  - [ ] Add stop sequences and max token limits

- [ ] **Context Management**
  - [ ] Track conversation history (limited buffer)
  - [ ] Include current project context
  - [ ] Add block/sprite descriptions
  - [ ] Clear context management

#### Files to Create:
- `ai/onnx-runtime.js` - ONNX wrapper
- `ai/model-loader.js` - Model download/cache
- `ai/inference.js` - Inference engine
- `ai/context.js` - Context builder
- `ui/model-installer.jsx` - Installation UI

#### Testing:
- Test on devices with varying RAM (4GB, 8GB, 16GB+)
- Test on integrated vs. dedicated GPUs
- Measure inference speed (tokens/sec)
- Test model quality (educational prompts)

**Estimated Effort**: 80-120 hours

---

### Phase 4: Tool Calling & UI Interaction 🎯
**Target**: Q2-Q3 2026  
**Priority**: High

#### Goals:
Enable Boxy to interact with the OmniBlocks interface programmatically.

#### Tasks:
- [ ] **Tool System Architecture**
  - [ ] Define tool schema/interface
  - [ ] Implement tool registry
  - [ ] Add tool calling parser (from LLM output)
  - [ ] Add tool result formatter

- [ ] **Movement Tools**
  - [ ] `moveTo(x, y)` - Move Boxy to coordinates
  - [ ] `pointAt(element)` - Point at UI element
  - [ ] `lookAt(element)` - Turn to face element
  - [ ] `moveToBlock(blockId)` - Move to specific block

- [ ] **UI Query Tools**
  - [ ] `getBlockPosition(blockId)` - Get block coordinates
  - [ ] `getButtonPosition(name)` - Get button coordinates
  - [ ] `getCategoryPosition(name)` - Get category position
  - [ ] `getSpritePosition(name)` - Get sprite list item position

- [ ] **Code Analysis Tools**
  - [ ] `getProjectBlocks()` - Get all blocks in project
  - [ ] `getSelectedSprite()` - Get current sprite
  - [ ] `getVariables()` - Get project variables
  - [ ] `analyzeCode()` - Basic code analysis

- [ ] **UI Interaction Tools** (Read-only first!)
  - [ ] `highlightBlock(blockId)` - Visually highlight
  - [ ] `highlightCategory(name)` - Highlight category
  - [ ] `showTooltip(element, text)` - Show tooltip
  
- [ ] **Code Modification Tools** (Future, with user confirmation!)
  - [ ] `suggestBlock(category, block)` - Show suggestion
  - [ ] `addBlock(location, block)` - Add block with animation
  - [ ] `moveBlock(blockId, x, y)` - Move block
  - [ ] `deleteBlock(blockId)` - Delete block (with undo!)

#### Files to Create:
- `tools/registry.js` - Tool system
- `tools/movement.js` - Movement tools
- `tools/ui-query.js` - UI query tools
- `tools/code-analysis.js` - Code analysis
- `tools/interaction.js` - UI interaction

#### Testing:
- Test tool calling accuracy (LLM->function calls)
- Test coordinate calculations on different screen sizes
- Test performance with many tools available
- Test safety (can't break projects)

**Estimated Effort**: 60-80 hours

---

### Phase 5: Chat Interface & Interaction 💬
**Target**: Q3 2026  
**Priority**: Medium

#### Goals:
Create a proper chat interface for extended conversations with Boxy.

#### Tasks:
- [ ] **Chat UI**
  - [ ] Design chat panel (collapsible sidebar?)
  - [ ] Implement message history
  - [ ] Add input field with send button
  - [ ] Add voice input (speech-to-text)
  - [ ] Add voice output (text-to-speech)

- [ ] **Conversation Management**
  - [ ] Track conversation context
  - [ ] Add conversation reset button
  - [ ] Save conversation history (localStorage)
  - [ ] Add export conversation feature

- [ ] **Smart Features**
  - [ ] Code block suggestions in chat
  - [ ] Inline previews of blocks
  - [ ] Quick action buttons
  - [ ] Context-aware suggestions

- [ ] **Settings**
  - [ ] Personality slider (helpful ↔ sassy)
  - [ ] Verbosity control (brief ↔ detailed)
  - [ ] Voice selection
  - [ ] Animation speed control

#### Files to Create:
- `ui/chat-panel.jsx` - Main chat UI
- `ui/message-list.jsx` - Message history
- `ui/input-field.jsx` - Input component
- `conversation/manager.js` - Conversation state

#### Testing:
- Test chat performance with long histories
- Test voice input accuracy
- Test accessibility (screen readers)
- User experience testing

**Estimated Effort**: 40-60 hours

---

### Phase 6: API Key Support (Optional) ⚠️
**Target**: Q3 2026  
**Priority**: Low

#### Goals:
Support cloud AI as fallback for low-end devices, with strong privacy warnings.

#### Tasks:
- [ ] **API Integration**
  - [ ] OpenAI API support
  - [ ] Anthropic Claude API support
  - [ ] Google Gemini API support
  - [ ] Groq API support (fast inference)

- [ ] **Privacy Warnings**
  - [ ] Design scary warning dialog
  - [ ] Explain data implications clearly
  - [ ] Require explicit consent
  - [ ] Show warning on every session start

- [ ] **API Key Management**
  - [ ] Secure storage (not plaintext!)
  - [ ] Key validation
  - [ ] Usage tracking
  - [ ] Cost warnings (if applicable)

- [ ] **Fallback Logic**
  - [ ] Detect insufficient resources
  - [ ] Offer API key option
  - [ ] Guide user through setup
  - [ ] Always prefer local first

#### Files to Create:
- `ai/api/openai.js` - OpenAI integration
- `ai/api/anthropic.js` - Claude integration
- `ai/api/google.js` - Gemini integration
- `ui/api-warning.jsx` - Warning dialog
- `settings/api-keys.jsx` - Key management

**Estimated Effort**: 20-30 hours

---

### Phase 7: Advanced Features 🚀
**Target**: Q4 2026 and beyond  
**Priority**: Low

#### Ideas:
- [ ] **Project Analysis**
  - [ ] Detect common patterns
  - [ ] Suggest optimizations
  - [ ] Find potential bugs
  - [ ] Code quality metrics

- [ ] **Tutorial Integration**
  - [ ] Guided tutorials with Boxy
  - [ ] Step-by-step walkthroughs
  - [ ] Interactive challenges
  - [ ] Achievement system

- [ ] **Customization**
  - [ ] Custom Boxy skins
  - [ ] Different AI personalities
  - [ ] Custom prompts/behavior
  - [ ] Theme integration

- [ ] **Collaboration**
  - [ ] Multi-user hints (if applicable)
  - [ ] Share helpful tips
  - [ ] Community prompts

- [ ] **Accessibility**
  - [ ] Screen reader support
  - [ ] High contrast mode
  - [ ] Keyboard navigation
  - [ ] Reduced motion option

#### Estimated Effort: Ongoing

---

## Development Guidelines

### Code Style
- Follow existing OmniBlocks conventions
- Write clear, commented code
- Keep functions small and focused
- Use meaningful variable names

### Testing
- Write unit tests for new features
- Test on multiple browsers
- Test on low-end devices
- User testing before major releases

### Documentation
- Update README for new features
- Add inline code comments
- Update USAGE guide
- Create examples for complex features

### Performance
- Optimize for 60 FPS animations
- Minimize memory usage
- Lazy-load AI models
- Profile regularly

### Privacy
- Local-first always
- Clear data handling
- User consent required
- Open about data usage

---

## Contributing

Want to help build Boxy? Here's how:

1. **Pick a Task**: Choose from roadmap phases above
2. **Open an Issue**: Discuss your approach first
3. **Create a Branch**: `feature/boxy-[feature-name]`
4. **Implement**: Follow guidelines above
5. **Test Thoroughly**: Multiple devices/browsers
6. **Document**: Update relevant docs
7. **Submit PR**: Link to original issue

### Priority Areas:
🔴 **High Priority**: AI Integration, Tool Calling  
🟡 **Medium Priority**: Enhanced Animations, Chat Interface  
🟢 **Low Priority**: API Key Support, Advanced Features

---

## Technical Debt

Things to address as we grow:

- [ ] Refactor userscript.js into modules
- [ ] Extract SVG to separate file/component
- [ ] Improve animation performance profiling
- [ ] Add proper error boundaries
- [ ] Implement state machine pattern properly
- [ ] Add telemetry (privacy-preserving!)
- [ ] Optimize bundle size

---

## Questions & Design Decisions

### Open Questions:
- **Model Selection**: Which small model works best for education?
- **Voice**: Built-in TTS or external service?
- **Customization**: How much is too much?
- **Performance**: What's the minimum viable device?

### Decided:
✅ **Local-First**: AI runs locally, cloud is optional  
✅ **Privacy-First**: No tracking, no data collection  
✅ **Educational Focus**: Teach concepts, not write code  
✅ **Non-Intrusive**: Toggleable, movable, dismissible  
✅ **Open Source**: All code is visible and auditable

---

## Success Metrics

How do we know Boxy is successful?

- **Adoption**: % of OmniBlocks users who enable Boxy
- **Retention**: % who keep it enabled after 1 week
- **Engagement**: Average interactions per session
- **Helpfulness**: User feedback/ratings
- **Learning**: Do users understand concepts better?
- **Privacy**: 0 data leaks or privacy violations
- **Performance**: < 5% impact on editor performance

---

## Long-Term Vision

Boxy should become:
- 🎓 The best AI teaching assistant for kids learning to code
- 🔒 A model of privacy-preserving AI
- 🌟 A fun, engaging character kids want to interact with
- 🚀 A showcase of what's possible with local AI
- 🎨 A platform for creative AI interactions

**Goal**: Make learning to code fun, safe, and effective with AI assistance.

---

## Resources

### Useful Links:
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
- [WebGPU Specification](https://www.w3.org/TR/webgpu/)
- [Hugging Face Models](https://huggingface.co/models)
- [Scratch Addons Documentation](https://scratchaddons.com/)

### Model Options:
- [Phi-2 (2.7B)](https://huggingface.co/microsoft/phi-2)
- [Gemma 2B](https://huggingface.co/google/gemma-2b)
- [TinyLlama (1.1B)](https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0)
- [Qwen2-0.5B](https://huggingface.co/Qwen/Qwen2-0.5B)

### Learning Resources:
- [WebGPU Fundamentals](https://webgpufundamentals.org/)
- [ONNX Model Zoo](https://github.com/onnx/models)
- [LLM Tool Calling](https://platform.openai.com/docs/guides/function-calling)

---

**Last Updated**: January 30, 2026  
**Maintainers**: @supervoidcoder, OmniBlocks Team  
**Status**: Phase 1 Complete, Phase 2 Planning

---

_"Sorry, buddy. I can suggest things to you, help you learn a concept, or brainstorm fun things, but if you're here to vibe code, this ain't the place for you, pal."_ 
— Boxy's Philosophy
