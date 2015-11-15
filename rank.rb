require 'json'
require 'date'
require 'time'

data = File.read('./cmoa.json')

d = JSON.parse(data)

today = Date.strptime("2015-11-14", "%Y-%m-%d")

depts = d["things"].group_by {|t|
    begin
      if t["department"]
        t["department"]
      else
        ""
      end
    rescue
    end
  }

ranks = d["things"].map{|t|
  height = (t["item_height"] && t["item_height"] != 0) ? t["item_height"] : 16.20082
  width = (t["item_width"] && t["item_width"] != 0) ? t["item_width"] : 15.90843
  depth = (t["item_depth"]) ? t["item_depth"] : 0
  diameter = (t["item_diameter"]) ? t["item_diameter"] : 0
  dept = t["department"] ? t["department"] : "Fine Arts"

  created_date = (t["created_date_latest"]) ? t["created_date_latest"] : "-0490-06-21"

  if diameter == 0
    if depth != 0
      tempVal = height * width * depth
    else
      tempVal = height * width
    end
  else
    tempVal = height * Math::PI * diameter / 2
  end

  tempVal /= 1000

  created = Date.strptime(created_date, "%Y-%m-%d")
  diff = (today - created).to_i

  ans = tempVal * diff / depts[dept].count
}.sort

puts "Normalizing..."

normalizedRanks = ranks.map.with_index{|v,k|
  ((((k - 0) * (1000 - 1)) / (ranks.count - 0)) + 1).round(1)
}

nMinRank = Float::INFINITY
nMaxRank = Float::INFINITY * -1
nTotal = 0

normalizedRanks.each{|r|
  if r < nMinRank
    nMinRank = r
  end

  if r > nMaxRank
    nMaxRank = r
  end

  nTotal += r
}

nAvgRank = nTotal/normalizedRanks.count
puts "Normalized average Rank: " + nAvgRank.to_s

puts "Normalized minRank: " + nMinRank.to_s
puts "Normalized maxRank: " + nMaxRank.to_s