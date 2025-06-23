#!/usr/bin/env python3
"""
Snake Game in Python with Pygame

A modern implementation of the classic Snake game featuring:
- Smooth controls and animations
- Score tracking with progressive difficulty
- Colorful graphics with modern design
- Game over detection and restart functionality
- Sound effects (optional)
"""

import pygame
import random
import sys
from enum import Enum
from typing import List, Tuple, Optional


class Direction(Enum):
    """Enumeration for snake movement directions"""
    UP = (0, -1)
    DOWN = (0, 1)
    LEFT = (-1, 0)
    RIGHT = (1, 0)


class GameState(Enum):
    """Enumeration for game states"""
    MENU = "menu"
    PLAYING = "playing"
    PAUSED = "paused"
    GAME_OVER = "game_over"


class Colors:
    """Color constants for the game"""
    BLACK = (0, 0, 0)
    WHITE = (255, 255, 255)
    RED = (255, 0, 0)
    GREEN = (0, 255, 0)
    DARK_GREEN = (0, 180, 0)
    LIGHT_GREEN = (100, 255, 100)
    BLUE = (0, 0, 255)
    GRAY = (128, 128, 128)
    DARK_GRAY = (64, 64, 64)
    YELLOW = (255, 255, 0)
    ORANGE = (255, 165, 0)
    PURPLE = (128, 0, 128)
    BACKGROUND = (20, 20, 20)
    GRID_COLOR = (40, 40, 40)


class Snake:
    """Represents the snake in the game"""
    
    def __init__(self, initial_position: Tuple[int, int], cell_size: int):
        """
        Initialize the snake
        
        Args:
            initial_position: Starting grid position (x, y)
            cell_size: Size of each grid cell in pixels
        """
        self.cell_size = cell_size
        self.body: List[Tuple[int, int]] = []
        self.direction = Direction.RIGHT
        self.next_direction = Direction.RIGHT
        self.grow_count = 0
        
        # Create initial snake body
        x, y = initial_position
        for i in range(3):
            self.body.append((x - i, y))
    
    def update(self) -> bool:
        """
        Update snake position
        
        Returns:
            True if update was successful, False if collision occurred
        """
        # Update direction
        self.direction = self.next_direction
        
        # Calculate new head position
        head_x, head_y = self.body[0]
        dx, dy = self.direction.value
        new_head = (head_x + dx, head_y + dy)
        
        # Insert new head
        self.body.insert(0, new_head)
        
        # Remove tail if not growing
        if self.grow_count > 0:
            self.grow_count -= 1
        else:
            self.body.pop()
        
        return True
    
    def change_direction(self, new_direction: Direction) -> None:
        """
        Queue a direction change for the next update
        
        Args:
            new_direction: The new direction to move in
        """
        # Prevent snake from going back into itself
        opposite_directions = {
            Direction.UP: Direction.DOWN,
            Direction.DOWN: Direction.UP,
            Direction.LEFT: Direction.RIGHT,
            Direction.RIGHT: Direction.LEFT
        }
        
        if new_direction != opposite_directions.get(self.direction):
            self.next_direction = new_direction
    
    def grow(self, amount: int = 1) -> None:
        """
        Make the snake grow
        
        Args:
            amount: Number of segments to grow
        """
        self.grow_count += amount
    
    def draw(self, screen: pygame.Surface) -> None:
        """
        Draw the snake on the screen
        
        Args:
            screen: Pygame surface to draw on
        """
        for i, segment in enumerate(self.body):
            x, y = segment
            rect = pygame.Rect(
                x * self.cell_size,
                y * self.cell_size,
                self.cell_size,
                self.cell_size
            )
            
            # Head is brighter with eyes
            if i == 0:
                pygame.draw.rect(screen, Colors.GREEN, rect)
                pygame.draw.rect(screen, Colors.LIGHT_GREEN, rect, 2)
                
                # Draw eyes based on direction
                eye_size = 4
                eye_offset = 6
                if self.direction == Direction.UP:
                    eye1 = (rect.x + eye_offset, rect.y + eye_offset)
                    eye2 = (rect.x + rect.width - eye_offset - eye_size, rect.y + eye_offset)
                elif self.direction == Direction.DOWN:
                    eye1 = (rect.x + eye_offset, rect.y + rect.height - eye_offset - eye_size)
                    eye2 = (rect.x + rect.width - eye_offset - eye_size, rect.y + rect.height - eye_offset - eye_size)
                elif self.direction == Direction.LEFT:
                    eye1 = (rect.x + eye_offset, rect.y + eye_offset)
                    eye2 = (rect.x + eye_offset, rect.y + rect.height - eye_offset - eye_size)
                else:  # RIGHT
                    eye1 = (rect.x + rect.width - eye_offset - eye_size, rect.y + eye_offset)
                    eye2 = (rect.x + rect.width - eye_offset - eye_size, rect.y + rect.height - eye_offset - eye_size)
                
                pygame.draw.rect(screen, Colors.BLACK, (*eye1, eye_size, eye_size))
                pygame.draw.rect(screen, Colors.BLACK, (*eye2, eye_size, eye_size))
            else:
                # Body segments with gradient
                color = Colors.DARK_GREEN if i % 2 == 0 else Colors.GREEN
                pygame.draw.rect(screen, color, rect)
                pygame.draw.rect(screen, Colors.BLACK, rect, 1)
    
    def get_head(self) -> Tuple[int, int]:
        """Get the position of the snake's head"""
        return self.body[0]
    
    def check_self_collision(self) -> bool:
        """Check if the snake has collided with itself"""
        if len(self.body) < 2:
            return False
        head = self.body[0]
        return head in self.body[1:]


class Food:
    """Represents food items in the game"""
    
    def __init__(self, cell_size: int):
        """
        Initialize food
        
        Args:
            cell_size: Size of each grid cell in pixels
        """
        self.cell_size = cell_size
        self.position: Optional[Tuple[int, int]] = None
        self.color = Colors.RED
    
    def spawn(self, grid_width: int, grid_height: int, occupied_positions: List[Tuple[int, int]]) -> None:
        """
        Spawn food at a random unoccupied position
        
        Args:
            grid_width: Width of the game grid
            grid_height: Height of the game grid
            occupied_positions: List of positions that are already occupied
        """
        available_positions = []
        
        # Find all available positions
        for x in range(grid_width):
            for y in range(grid_height):
                pos = (x, y)
                if pos not in occupied_positions:
                    available_positions.append(pos)
        
        # Choose random position if available
        if available_positions:
            self.position = random.choice(available_positions)
            # Randomly choose food color for variety
            self.color = random.choice([Colors.RED, Colors.ORANGE, Colors.PURPLE])
    
    def draw(self, screen: pygame.Surface) -> None:
        """
        Draw the food on the screen
        
        Args:
            screen: Pygame surface to draw on
        """
        if self.position:
            x, y = self.position
            center = (
                x * self.cell_size + self.cell_size // 2,
                y * self.cell_size + self.cell_size // 2
            )
            radius = self.cell_size // 2 - 2
            
            # Draw food as a circle with glow effect
            pygame.draw.circle(screen, self.color, center, radius)
            pygame.draw.circle(screen, Colors.WHITE, center, radius // 3)


class SnakeGame:
    """Main game class that handles the game logic and rendering"""
    
    def __init__(self):
        """Initialize the game"""
        pygame.init()
        
        # Game configuration
        self.cell_size = 20
        self.grid_width = 30
        self.grid_height = 20
        self.screen_width = self.cell_size * self.grid_width
        self.screen_height = self.cell_size * self.grid_height + 80  # Extra space for UI
        
        # Create screen
        self.screen = pygame.display.set_mode((self.screen_width, self.screen_height))
        pygame.display.set_caption("Snake Game - Pygame Edition")
        
        # Clock for controlling frame rate
        self.clock = pygame.time.Clock()
        self.game_speed = 10  # Initial FPS (snake moves per second)
        self.max_speed = 30
        
        # Fonts
        self.font_large = pygame.font.Font(None, 48)
        self.font_medium = pygame.font.Font(None, 36)
        self.font_small = pygame.font.Font(None, 24)
        
        # Game state
        self.state = GameState.MENU
        self.score = 0
        self.high_score = 0
        
        # Game objects
        self.snake = None
        self.food = None
        
        self.reset_game()
    
    def reset_game(self) -> None:
        """Reset the game to initial state"""
        self.snake = Snake((self.grid_width // 2, self.grid_height // 2), self.cell_size)
        self.food = Food(self.cell_size)
        self.food.spawn(self.grid_width, self.grid_height, self.snake.body)
        self.score = 0
        self.game_speed = 10
    
    def handle_events(self) -> bool:
        """
        Handle pygame events
        
        Returns:
            False if game should quit, True otherwise
        """
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            
            if event.type == pygame.KEYDOWN:
                if self.state == GameState.MENU:
                    if event.key == pygame.K_SPACE:
                        self.state = GameState.PLAYING
                        self.reset_game()
                    elif event.key == pygame.K_ESCAPE:
                        return False
                
                elif self.state == GameState.PLAYING:
                    if event.key == pygame.K_UP or event.key == pygame.K_w:
                        self.snake.change_direction(Direction.UP)
                    elif event.key == pygame.K_DOWN or event.key == pygame.K_s:
                        self.snake.change_direction(Direction.DOWN)
                    elif event.key == pygame.K_LEFT or event.key == pygame.K_a:
                        self.snake.change_direction(Direction.LEFT)
                    elif event.key == pygame.K_RIGHT or event.key == pygame.K_d:
                        self.snake.change_direction(Direction.RIGHT)
                    elif event.key == pygame.K_p:
                        self.state = GameState.PAUSED
                    elif event.key == pygame.K_ESCAPE:
                        self.state = GameState.MENU
                
                elif self.state == GameState.PAUSED:
                    if event.key == pygame.K_p or event.key == pygame.K_SPACE:
                        self.state = GameState.PLAYING
                    elif event.key == pygame.K_ESCAPE:
                        self.state = GameState.MENU
                
                elif self.state == GameState.GAME_OVER:
                    if event.key == pygame.K_SPACE:
                        self.state = GameState.PLAYING
                        self.reset_game()
                    elif event.key == pygame.K_ESCAPE:
                        self.state = GameState.MENU
        
        return True
    
    def update(self) -> None:
        """Update game logic"""
        if self.state != GameState.PLAYING:
            return
        
        # Update snake
        self.snake.update()
        
        # Check wall collision
        head_x, head_y = self.snake.get_head()
        if (head_x < 0 or head_x >= self.grid_width or 
            head_y < 0 or head_y >= self.grid_height):
            self.game_over()
            return
        
        # Check self collision
        if self.snake.check_self_collision():
            self.game_over()
            return
        
        # Check food collision
        if self.snake.get_head() == self.food.position:
            self.snake.grow()
            self.score += 10
            
            # Increase difficulty
            if self.game_speed < self.max_speed:
                self.game_speed += 0.5
            
            # Spawn new food
            self.food.spawn(self.grid_width, self.grid_height, self.snake.body)
    
    def game_over(self) -> None:
        """Handle game over"""
        self.state = GameState.GAME_OVER
        if self.score > self.high_score:
            self.high_score = self.score
    
    def draw_grid(self) -> None:
        """Draw the background grid"""
        for x in range(self.grid_width):
            for y in range(self.grid_height):
                rect = pygame.Rect(
                    x * self.cell_size,
                    y * self.cell_size + 80,
                    self.cell_size,
                    self.cell_size
                )
                pygame.draw.rect(self.screen, Colors.GRID_COLOR, rect, 1)
    
    def draw_ui(self) -> None:
        """Draw the UI elements"""
        # Draw header background
        pygame.draw.rect(self.screen, Colors.DARK_GRAY, (0, 0, self.screen_width, 80))
        
        # Draw score
        score_text = self.font_medium.render(f"Score: {self.score}", True, Colors.WHITE)
        self.screen.blit(score_text, (20, 20))
        
        # Draw high score
        high_score_text = self.font_medium.render(f"High Score: {self.high_score}", True, Colors.YELLOW)
        self.screen.blit(high_score_text, (self.screen_width - high_score_text.get_width() - 20, 20))
        
        # Draw speed indicator
        speed_text = self.font_small.render(f"Speed: {int(self.game_speed)}", True, Colors.GRAY)
        self.screen.blit(speed_text, (self.screen_width // 2 - speed_text.get_width() // 2, 50))
    
    def draw_menu(self) -> None:
        """Draw the main menu"""
        self.screen.fill(Colors.BACKGROUND)
        
        # Title
        title_text = self.font_large.render("SNAKE GAME", True, Colors.GREEN)
        title_rect = title_text.get_rect(center=(self.screen_width // 2, 150))
        self.screen.blit(title_text, title_rect)
        
        # Instructions
        instructions = [
            "Press SPACE to Start",
            "Use Arrow Keys or WASD to Move",
            "Press P to Pause",
            "Press ESC for Menu",
            "",
            f"High Score: {self.high_score}"
        ]
        
        y_offset = 250
        for instruction in instructions:
            if instruction:
                text = self.font_small.render(instruction, True, Colors.WHITE)
                text_rect = text.get_rect(center=(self.screen_width // 2, y_offset))
                self.screen.blit(text, text_rect)
            y_offset += 30
    
    def draw_game_over(self) -> None:
        """Draw the game over screen"""
        # Darken the game area
        overlay = pygame.Surface((self.screen_width, self.screen_height))
        overlay.set_alpha(180)
        overlay.fill(Colors.BLACK)
        self.screen.blit(overlay, (0, 0))
        
        # Game Over text
        game_over_text = self.font_large.render("GAME OVER", True, Colors.RED)
        game_over_rect = game_over_text.get_rect(center=(self.screen_width // 2, 200))
        self.screen.blit(game_over_text, game_over_rect)
        
        # Score
        score_text = self.font_medium.render(f"Score: {self.score}", True, Colors.WHITE)
        score_rect = score_text.get_rect(center=(self.screen_width // 2, 250))
        self.screen.blit(score_text, score_rect)
        
        # New high score message
        if self.score == self.high_score and self.score > 0:
            high_score_text = self.font_medium.render("NEW HIGH SCORE!", True, Colors.YELLOW)
            high_score_rect = high_score_text.get_rect(center=(self.screen_width // 2, 290))
            self.screen.blit(high_score_text, high_score_rect)
        
        # Restart instruction
        restart_text = self.font_small.render("Press SPACE to Play Again", True, Colors.WHITE)
        restart_rect = restart_text.get_rect(center=(self.screen_width // 2, 350))
        self.screen.blit(restart_text, restart_rect)
        
        menu_text = self.font_small.render("Press ESC for Menu", True, Colors.WHITE)
        menu_rect = menu_text.get_rect(center=(self.screen_width // 2, 380))
        self.screen.blit(menu_text, menu_rect)
    
    def draw_paused(self) -> None:
        """Draw the pause screen"""
        # Darken the game area
        overlay = pygame.Surface((self.screen_width, self.screen_height))
        overlay.set_alpha(100)
        overlay.fill(Colors.BLACK)
        self.screen.blit(overlay, (0, 0))
        
        # Paused text
        paused_text = self.font_large.render("PAUSED", True, Colors.WHITE)
        paused_rect = paused_text.get_rect(center=(self.screen_width // 2, self.screen_height // 2))
        self.screen.blit(paused_text, paused_rect)
        
        # Resume instruction
        resume_text = self.font_small.render("Press P or SPACE to Resume", True, Colors.WHITE)
        resume_rect = resume_text.get_rect(center=(self.screen_width // 2, self.screen_height // 2 + 50))
        self.screen.blit(resume_text, resume_rect)
    
    def draw(self) -> None:
        """Draw everything on the screen"""
        if self.state == GameState.MENU:
            self.draw_menu()
        else:
            # Clear screen
            self.screen.fill(Colors.BACKGROUND)
            
            # Draw game area background
            game_area = pygame.Rect(0, 80, self.screen_width, self.screen_height - 80)
            pygame.draw.rect(self.screen, Colors.BLACK, game_area)
            
            # Draw grid
            self.draw_grid()
            
            # Draw UI
            self.draw_ui()
            
            # Draw game objects
            if self.snake and self.food:
                # Offset drawing by UI height
                pygame.Surface.blit(self.screen, self.screen, (0, 0))
                
                # Create a subsurface for the game area
                game_surface = self.screen.subsurface((0, 80, self.screen_width, self.screen_height - 80))
                
                self.food.draw(game_surface)
                self.snake.draw(game_surface)
            
            # Draw overlays based on state
            if self.state == GameState.GAME_OVER:
                self.draw_game_over()
            elif self.state == GameState.PAUSED:
                self.draw_paused()
        
        # Update display
        pygame.display.flip()
    
    def run(self) -> None:
        """Main game loop"""
        running = True
        
        while running:
            # Handle events
            running = self.handle_events()
            
            # Update game logic
            self.update()
            
            # Draw everything
            self.draw()
            
            # Control frame rate based on game speed
            if self.state == GameState.PLAYING:
                self.clock.tick(self.game_speed)
            else:
                self.clock.tick(60)  # 60 FPS for menus
        
        pygame.quit()
        sys.exit()


def main():
    """Main function to run the game"""
    game = SnakeGame()
    game.run()


if __name__ == "__main__":
    main()