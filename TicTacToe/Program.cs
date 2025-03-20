namespace TicTacToe
{
	public class Program
	{
		static void Main()
		{
			Console.WriteLine("Choose difficulty: Easy, Medium, Hard");
			var difficulty = (Difficulty)Enum.Parse(typeof(Difficulty), Console.ReadLine(), true);

			GameRules game = new GameRules(difficulty);
			game.Start();
		}
	}
}
