using System;

namespace TicTacToe
{
	public class GameRules
	{
		private char[,] board;
		private char currentPlayer;
		private Bot bot;
		private Difficulty difficulty;

		public GameRules(Difficulty difficulty)
		{
			board = new char[3, 3];
			currentPlayer = 'X';
			this.difficulty = difficulty;
			bot = new Bot(difficulty);
			InitializeBoard();
		}

		private void InitializeBoard()
		{
			for (int i = 0; i < 3; i++)
			{
				for (int j = 0; j < 3; j++)
				{
					board[i, j] = ' ';
				}
			}
		}

		public void Start()
		{
			while (true)
			{
				PrintBoard();
				if (currentPlayer == 'X')
				{
					PlayerMove();
				}
				else
				{
					bot.MakeMove(board, currentPlayer);
				}

				if (CheckWinner())
				{
					PrintBoard();
					Console.WriteLine($"Player {currentPlayer} wins!");
					break;
				}

				if (IsBoardFull())
				{
					PrintBoard();
					Console.WriteLine("It's a draw!");
					break;
				}

				SwitchPlayer();
			}
		}

		private void PlayerMove()
		{
			int row, col;
			while (true)
			{
				Console.Write("Enter row (0-2): ");
				row = int.Parse(Console.ReadLine());
				Console.Write("Enter column (0-2): ");
				col = int.Parse(Console.ReadLine());

				if (row >= 0 && row < 3 && col >= 0 && col < 3 && board[row, col] == ' ')
				{
					board[row, col] = currentPlayer;
					break;
				}
				Console.WriteLine("Invalid move. Try again.");
			}
		}

		private void SwitchPlayer()
		{
			currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
		}

		private bool IsBoardFull()
		{
			foreach (var cell in board)
			{
				if (cell == ' ')
					return false;
			}
			return true;
		}

		private bool CheckWinner()
		{
			for (int i = 0; i < 3; i++)
			{
				if ((board[i, 0] != ' ' && board[i, 0] == board[i, 1] && board[i, 1] == board[i, 2]) ||
					(board[0, i] != ' ' && board[0, i] == board[1, i] && board[1, i] == board[2, i]))
				{
					return true;
				}
			}

			if ((board[0, 0] != ' ' && board[0, 0] == board[1, 1] && board[1, 1] == board[2, 2]) ||
				(board[0, 2] != ' ' && board[0, 2] == board[1, 1] && board[1, 1] == board[2, 0]))
			{
				return true;
			}

			return false;
		}

		private void PrintBoard()
		{
			Console.Clear();
			for (int i = 0; i < 3; i++)
			{
				for (int j = 0; j < 3; j++)
				{
					Console.Write(board[i, j]);
					if (j < 2) Console.Write(" | ");
				}
				Console.WriteLine();
				if (i < 2) Console.WriteLine("--+---+--");
			}
			Console.WriteLine();
		}
	}
}
