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

minRank = Float::INFINITY
maxRank = Float::INFINITY * -1
total = 0

ranks.each{|t|
  if t < minRank
    minRank = t
  end

  if t > maxRank
    maxRank = t
  end

  total += t
}

avgRank = total/ranks.count
puts "Average Rank: " + avgRank.to_s

puts "minRank: " + minRank.to_s
puts "maxRank: " + maxRank.to_s