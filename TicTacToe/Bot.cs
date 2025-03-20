using System;

namespace TicTacToe
{
	public class Bot
	{
		private Difficulty difficulty;
		private Random random = new Random();

		public Bot(Difficulty difficulty)
		{
			this.difficulty = difficulty;
		}

		public void MakeMove(char[,] board, char player)
		{
			if (difficulty == Difficulty.Easy)
			{
				RandomMove(board, player);
			}
			else if (difficulty == Difficulty.Medium)
			{
				if (!TryWinningMove(board, player))
					RandomMove(board, player);
			}
			else
			{
				if (!TryWinningMove(board, player))
					if (!TryBlockingMove(board, player))
						RandomMove(board, player);
			}
		}

		private void RandomMove(char[,] board, char player)
		{
			int row, col;
			do
			{
				row = random.Next(0, 3);
				col = random.Next(0, 3);
			} while (board[row, col] != ' ');

			board[row, col] = player;
		}

		private bool TryWinningMove(char[,] board, char player)
		{
			for (int i = 0; i < 3; i++)
			{
				for (int j = 0; j < 3; j++)
				{
					if (board[i, j] == ' ')
					{
						board[i, j] = player;
						if (CheckWinner(board, player))
						{
							return true;
						}
						board[i, j] = ' ';
					}
				}
			}
			return false;
		}

		private bool TryBlockingMove(char[,] board, char player)
		{
			char opponent = (player == 'X') ? 'O' : 'X';
			return TryWinningMove(board, opponent);
		}

		private bool CheckWinner(char[,] board, char player)
		{
			for (int i = 0; i < 3; i++)
			{
				if ((board[i, 0] == player && board[i, 1] == player && board[i, 2] == player) ||
					(board[0, i] == player && board[1, i] == player && board[2, i] == player))
					return true;
			}

			if ((board[0, 0] == player && board[1, 1] == player && board[2, 2] == player) ||
				(board[0, 2] == player && board[1, 1] == player && board[2, 0] == player))
				return true;

			return false;
		}
	}
}
