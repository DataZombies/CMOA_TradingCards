require 'json'
require 'date'
require 'time'

  data = File.read('./cmoa.json')

  d = JSON.parse(data)

  artist_ids = d["things"].flat_map {|t|
    begin
      t["creator"].map {|c| c["artist_id"] }
    rescue
      next
    end
  }.uniq

grouped = d["things"].group_by {|t|
    begin
      creator = t["creator"][0]
      creator["artist_id"] if creator
    rescue
    end
  }

mediums = d["things"].flat_map {|t|
  if m = t["medium"]
    m
    #m.split(" ").map{|str|
    #  str.tr(";:,","")
    #  }[0]
  else
   []
  end
}.uniq

departments = d["things"].flat_map {|t|
  if department = t["department"]
    department
  else
    []
  end
  }.uniq

minHeight = Float::INFINITY
maxHeight = 0
total = 0

d["things"].each {|m|
  if height = m["item_diameter"]
      if height < minHeight
        minHeight = height
      end

      if height > maxHeight
        maxHeight = height
      end

      total += height
    []
  else
    []
  end
}

avg = total / d["things"].count

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


today = Date.strptime("2015-11-14", "%Y-%m-%d")

enddates = d["things"].map{|t|
  next unless datestr = t["creation_date_latest"]
  Date.strptime(datestr, "%Y-%m-%d")
}.compact

mindate = enddates[0]

enddates.each{|d|
  if d < mindate
    mindate = d
  end
}

avg = Time.at((Time.parse(mindate.to_s).to_f + Time.parse(today.to_s).to_f) / 2)

avg_date = Date.parse(avg.to_s)

#depts.each{|k,v|
#  puts k.to_s + " Count: " + v.count.to_s
#}

#puts "Min height: " + minHeight.to_s
#puts "Max height: " + maxHeight.to_s
#puts "Average: " + avg.to_s

#Calculate power ranking

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

# minRank = Float::INFINITY
# maxRank = Float::INFINITY * -1
# total = 0

# ranks.each{|t|
#   if t < minRank
#     minRank = t
#   end

#   if t > maxRank
#     maxRank = t
#   end

#   total += t
# }

# avgRank = total/ranks.count
# puts "Average Rank: " + avgRank.to_s

# puts "minRank: " + minRank.to_s
# puts "maxRank: " + maxRank.to_s

