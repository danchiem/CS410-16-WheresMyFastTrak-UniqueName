package edu.ccsu.cs410.uniqueteam.ctfasttrakproject

public class BusStop {
	private double[] position;
	private Bus upcomingBus;
	private int stopId;

	public BusStop(double[] position, int stopId, Bus upcomingBus) {
		this.position = position;
		this.stopId = stopId;
		this.upcomingBus = upcomingBus;
	}

	public int getStopId() {
		return stopId;
	}

	public double[] getPosition() {
		return position;
	}

	public Bus getUpcomingBus()	{
		return upcomingBus;
	}
}