class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.scene = 'title';
        this.blinkTimer = 0;
        this.showClickToType = true;
        this.titleTimer = 0;
        this.endTimer = 0;
        this.showClickToRetry = false;
        this.revealedText = '';

        // Game content
        this.chineseText = '事实上 时势是使世事失实的原因';
        this.pinyinText = ['shi', 'shi', 'shang', null, 'shi', 'shi', 'shi', 'shi', 'shi', 'shi', 'shi', 'shi', 'de', 'yuan', 'yin'];
        this.pinyinIndex = 0;
        this.englishTranslation = 'In fact, the times are the reason why things become unreal.';
        
        // Character selection grids
        this.shiChars = [
            '是', '时', '实', '识', '史', '师',
            '始', '诗', '施', '十', '石', '食',
            '使', '士', '世', '市', '式', '势',
            '事', '失', '室', '视', '试', '适',
            '示', '释', '饰', '尸', '誓', '湿'
        ];
        this.shangChars = [
            '上', '商', '伤', '尚', '赏', '晌',
            '裳', '觞', '殇', '熵', '觴', '绱',
            '垧', '墒', '扄', '绱', '鞝', '伤',
            '赏', '湯', '殤', '蠰', '鑜', '謪',
            '鬺', '蔏', '螪', '鎟', '鯴', '鱨'
        ];
        this.deChars = [
            '的', '得', '德', '地', '底', '锝',
            '嘚', '徳', '悳', '淂', '登', '等',
            '蹬', '戴', '灯', '邓', '凳', '瞪',
            '澄', '磴', '镝', '嶝', '簦', '鐙',
            '墱', '鍀', '燈', '竚', '襯', '鐙'
        ];
        this.yuanChars = [
            '原', '源', '远', '园', '员', '圆',
            '院', '缘', '援', '元', '怨', '媛',
            '渊', '冤', '垣', '袁', '苑', '猿',
            '辕', '沅', '橼', '鸢', '鸳', '塬',
            '爰', '螈', '鼋', '騵', '蜎', '蝯'
        ];
        this.yinChars = [
            '因', '音', '引', '印', '银', '饮',
            '阴', '隐', '茵', '殷', '姻', '瘾',
            '吟', '寅', '淫', '荫', '尹', '蚓',
            '垠', '龈', '鄞', '夤', '霪', '狺',
            '訚', '廕', '慇', '欭', '飲', '銀'
        ];
        this.currentRow = 0;
        
        // Input handling
        this.currentInput = '';
        this.currentCharIndex = 0;
        this.candidateChars = [];
        this.selectedChar = null;

        // Event listeners
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Start game loop
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        if (this.scene === 'title') {
            this.titleTimer += deltaTime;
            if (this.titleTimer >= 1500) { // 1.5 seconds delay
                this.blinkTimer += deltaTime;
                if (this.blinkTimer >= 500) { // Blink every 0.5 seconds
                    this.showClickToType = !this.showClickToType;
                    this.blinkTimer = 0;
                }
            }
        } else if (this.scene === 'end') {
            this.endTimer += deltaTime;
            if (this.endTimer >= 1500) { // 1.5 seconds delay
                this.blinkTimer += deltaTime;
                if (this.blinkTimer >= 500) { // Blink every 0.5 seconds
                    this.showClickToRetry = !this.showClickToRetry;
                    this.blinkTimer = 0;
                }
            }
        }
    }

    draw() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        switch (this.scene) {
            case 'title':
                this.drawTitleScreen();
                break;
            case 'game':
                this.drawGameScreen();
                break;
            case 'end':
                this.drawEndScreen();
                break;
        }
    }

    drawTitleScreen() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        
        // Draw title
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillText('Pain of Typing Chinese', this.width / 2, this.height / 3);

        // Draw description
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Come on, type some Chinese. It\'ll be FUN!', this.width / 2, this.height / 2);

        // Draw blinking text
        if (this.titleTimer >= 1500 && this.showClickToType) {
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Click to type', this.width / 2, this.height * 0.7);
        }
    }

    drawGameScreen() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        
        // Draw English translation (progressively)
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#888888';
        this.ctx.fillText(this.revealedText, this.width / 2, this.height * 0.2);
        
        // Draw Chinese characters
        this.ctx.font = '32px Arial';
        let x = this.width * 0.2;
        const y = this.height * 0.3;
        
        for (let i = 0; i < this.chineseText.length; i++) {
            const char = this.chineseText[i];
            if (i === this.currentCharIndex) {
                this.ctx.fillStyle = '#ffff00';
            } else if (i < this.currentCharIndex) {
                this.ctx.fillStyle = '#00ff00';
            } else {
                this.ctx.fillStyle = '#ffffff';
            }
            this.ctx.fillText(char, x, y);
            
            // Draw pinyin below
            this.ctx.font = '16px Arial';
            if (this.pinyinText[i] !== null) {
                if (i === this.currentCharIndex) {
                    this.ctx.fillStyle = '#ffff00';
                } else if (i < this.currentCharIndex) {
                    this.ctx.fillStyle = '#00ff00';
                } else {
                    this.ctx.fillStyle = '#888888';
                }
                this.ctx.fillText(this.pinyinText[i], x, y + 30);
            }
            
            this.ctx.font = '32px Arial';
            x += 50;
        }

        // Draw input box
        // Draw input box
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(this.width * 0.3, this.height * 0.45, this.width * 0.4, 40);
        this.ctx.fillStyle = '#888888';
        this.ctx.font = '16px Arial';
        if (this.currentInput === '') {
            this.ctx.fillText('Type the letters above in order', this.width * 0.5, this.height * 0.45 + 25);
        }
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        if (this.currentInput !== '') {
            this.ctx.fillText(this.currentInput, this.width * 0.5, this.height * 0.45 + 25);
        }

        // Draw character selection grid
        if (this.candidateChars.length > 0 && ['shi', 'shang', 'de', 'yuan', 'yin'].includes(this.currentInput)) {
            const gridStartY = this.height * 0.55;
            const cellHeight = 40;
            const cellWidth = 40;
            const gridWidth = 6 * cellWidth;
            const gridStartX = (this.width - gridWidth) / 2;

            for (let row = 0; row < 5; row++) {
                // Draw row highlight
                if (row === this.currentRow) {
                    this.ctx.fillStyle = '#444444';
                    this.ctx.fillRect(gridStartX - 10, gridStartY + row * cellHeight - 5, 
                                    gridWidth + 20, cellHeight + 10);
                }

                for (let col = 0; col < 6; col++) {
                    const index = row * 6 + col;
                    const x = gridStartX + col * cellWidth;
                    const y = gridStartY + row * cellHeight;

                    // Draw character cell
                    this.ctx.fillStyle = '#333333';
                    this.ctx.fillRect(x, y, cellWidth - 5, cellHeight - 5);

                    // Draw character
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.font = '20px Arial';
                    let displayChar;
                    if (this.currentInput === 'shi') {
                        displayChar = this.shiChars[index];
                    } else if (this.currentInput === 'shang') {
                        displayChar = this.shangChars[index];
                    } else if (this.currentInput === 'de') {
                        displayChar = this.deChars[index];
                    } else if (this.currentInput === 'yuan') {
                        displayChar = this.yuanChars[index];
                    } else if (this.currentInput === 'yin') {
                        displayChar = this.yinChars[index];
                    }
                    this.ctx.fillText(displayChar, x + cellWidth/2, y + cellHeight/2 + 7);

                    // Draw number
                    this.ctx.fillStyle = '#888888';
                    this.ctx.font = '12px Arial';
                    this.ctx.fillText(col + 1, x + cellWidth/2, y + cellHeight - 5);
                }
            }

            // Draw navigation hint
            this.ctx.fillStyle = '#888888';
            this.ctx.font = '16px Arial';
            this.ctx.fillText('Use "[" or "]" to select row, numbers 1-6 to select character', 
                            this.width/2, gridStartY + 5 * cellHeight + 25);
        }
    }

    drawEndScreen() {
        // Empty implementation since we're using modal dialog
    }

    handleClick(event) {
        if (this.scene === 'title' && this.titleTimer >= 1500) {
            this.scene = 'game';
            document.getElementById('endModal').style.display = 'none';
        }
    }

    handleKeyDown(event) {
        if (this.scene !== 'game') return;

        if (['shi', 'shang', 'de', 'yuan', 'yin'].includes(this.currentInput) && this.candidateChars.length > 0) {
            // Handle character selection grid navigation
            if (event.key === '[') {
                this.currentRow = (this.currentRow - 1 + 5) % 5;
                return;
            } else if (event.key === ']') {
                this.currentRow = (this.currentRow + 1) % 5;
                return;
            } else if (event.key >= '1' && event.key <= '6') {
                const col = parseInt(event.key) - 1;
                const selectedIndex = this.currentRow * 6 + col;
                let selectedChar;
                if (this.currentInput === 'shi') {
                    selectedChar = this.shiChars[selectedIndex];
                } else if (this.currentInput === 'shang') {
                    selectedChar = this.shangChars[selectedIndex];
                } else if (this.currentInput === 'de') {
                    selectedChar = this.deChars[selectedIndex];
                } else if (this.currentInput === 'yuan') {
                    selectedChar = this.yuanChars[selectedIndex];
                } else if (this.currentInput === 'yin') {
                    selectedChar = this.yinChars[selectedIndex];
                }
                
                if (selectedChar === this.chineseText[this.currentCharIndex]) {
                    this.selectedChar = selectedChar;
                    this.currentInput = '';
                    this.candidateChars = [];
                    this.currentCharIndex++;
                    this.currentRow = 0;

                    // Update revealed text based on character combinations
                    const currentText = this.chineseText.substring(0, this.currentCharIndex);
                    let newRevealedText = 'In fact, the times are the reason why things become unreal.';
                    
                    // Gradually reveal the text based on character combinations
                    if (!currentText.includes('事实')) newRevealedText = newRevealedText.replace('fact', '');
                    if (!currentText.includes('上')) newRevealedText = newRevealedText.replace('In', '');
                    if (!currentText.includes('时势')) newRevealedText = newRevealedText.replace('the times', '');
                    if (!currentText.includes('是')) newRevealedText = newRevealedText.replace('are', '');
                    if (!currentText.includes('使世事')) newRevealedText = newRevealedText.replace('why things', '');
                    if (!currentText.includes('失实')) newRevealedText = newRevealedText.replace('become unreal', '');
                    if (!currentText.includes('的原因')) newRevealedText = newRevealedText.replace('the reason', '');
                    
                    this.revealedText = newRevealedText;

                    // Skip spaces after incrementing the index
                    while (this.currentCharIndex < this.chineseText.length && 
                           this.chineseText[this.currentCharIndex] === ' ') {
                        this.currentCharIndex++;
                    }

                    if (this.currentCharIndex >= this.chineseText.length) {
                        this.revealedText = this.englishTranslation;
                        setTimeout(() => {
                            document.getElementById('endModal').style.display = 'block';
                        }, 1500);
                    }
                }
                return;
            }
        }

        if (event.key === 'Backspace') {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateCandidates();
        } else if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
            this.currentInput += event.key.toLowerCase();
            this.updateCandidates();
        }
    }

    updateCandidates() {
        if (this.currentInput === '') {
            this.candidateChars = [];
            return;
        }

        // Find next valid pinyin (skip spaces)
        while (this.currentCharIndex < this.chineseText.length && this.chineseText[this.currentCharIndex] === ' ') {
            this.currentCharIndex++;
        }

        if (this.currentInput === this.pinyinText[this.currentCharIndex]) {
            if (this.currentInput === 'shi') {
                this.candidateChars = this.shiChars;
            } else if (this.currentInput === 'shang') {
                this.candidateChars = this.shangChars;
            } else if (this.currentInput === 'de') {
                this.candidateChars = this.deChars;
            } else if (this.currentInput === 'yuan') {
                this.candidateChars = this.yuanChars;
            } else if (this.currentInput === 'yin') {
                this.candidateChars = this.yinChars;
            } else {
                this.candidateChars = [this.chineseText[this.currentCharIndex]];
            }
        } else {
            this.candidateChars = [];
        }
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
};