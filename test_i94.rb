require 'pdf/reader'
require 'nokogiri'
require 'mechanize'
require 'ocr_space'
require 'watir'

#TEST ONE STUDENT PAGE TO CHECK FOR ERROR

print "Enter CalNet username: "
id = gets.chomp()
print "Enter CalNet password: "
pwd = gets.chomp()
print "Enter issm username: "
issm_user = gets.chomp()
print "Enter issm password: "
issm_pwd = gets.chomp()
print "Enter the earliest entry date that should be accepted: "
earliest_date = gets.chomp()
print "Enter link to student's uploaded i-94 page"
$link = gets.chomp()

#earliest_date = "7/1/2015"
$current_path = File.expand_path(__FILE__).split("/")[0...-1].join("/") + "/"

#ocr
api = 'c8ba42ba4888957'
$resource = OcrSpace::Resource.new(apikey: api)

$agent = Mechanize.new
begin
issm = $agent.get('https://issm.berkeley.edu/')
loginform = issm.form
loginform.UserName = issm_user
loginform.Password = issm_pwd
page = $agent.submit(loginform)
rescue
end

io = $agent.get("https://io.berkeley.edu")
login = io.form
login.username = id
login.password = pwd
page = $agent.submit(login)

$shortcut = $agent.get('https://issm.berkeley.edu/ListViewFrameset.asp?collegeId=3032095457&ID=84812')
$search = $shortcut.frames[1].click
$searchform = $search.form

def find_student(sid)
  $searchform.CampusId = sid
  student_page = $agent.submit($searchform, $searchform.buttons.first)
  search_name = student_page.css('a#ResultGrid_ctl02_NameHLINK').text
  quickview = student_page.link_with(:text => search_name).click
  type = quickview.css('span#BasicDataTable_ProfileType').text
  return search_name, type
end


$months = ["", "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"]

def parse_date(earliest_date)
  time = Time.new
  today = time.to_i
  today_m = time.month.to_i
  today_d = time.day.to_i
  today_y = time.year.to_i
  spl_date = earliest_date.split("/")
  earliest_m = spl_date[0].to_i
  earliest_d = spl_date[1].to_i
  earliest_y = spl_date[2].to_i
  earliest_date = Time.new(earliest_y, earliest_m, earliest_d).to_i
  return earliest_date, today
end

$earliest_date, $today = parse_date(earliest_date)

def valid_date(entry_line)
  spl = entry_line.split(":")
  if spl[0] == entry_line
    spl = entry_line.split(";")
  end
  if spl[0] == entry_line
    return false
  end
  date = spl[1]
  spl_date = date.split(" ")
  if spl_date.length < 3
    return false
  end
  m = spl_date[1].strip.gsub(/\A\p{Space}*|\p{Space}*\z/, '')
  month = $months.index(m)
  day = spl_date[2].strip.gsub(/\A\p{Space}*|\p{Space}*\z/, '').to_i
  year = spl_date[0].strip.gsub(/\A\p{Space}*|\p{Space}*\z/, '').to_i
  begin
  entry_date = Time.new(year, month, day).to_i
  rescue ArgumentError
    return false
  end
  puts "entry date: (#{entry_date}) " + month.to_s + "/" + day.to_s + "/" + year.to_s
  if entry_date <= $today and entry_date >= $earliest_date
    return true
  end
  return false
end


def correct_image(result)
  if result == ""
    return
  end
  open("#{$current_path}log", "a") { |f|
    f.puts "\n"
    f.puts "\n"
    f.puts "===================="
    f.puts $last_name + ", " + $first_name
    f.puts result
    f.puts "===================="
    f.puts "\n"
    f.puts "\n"
  }
  entry_s = result.index("Entry")
  entry_e = result.index("Class")
  if entry_s != nil and entry_e != nil
    entry_date = result[entry_s...entry_e]
    puts entry_date
    if valid_date(entry_date)
      $entry = true
    end
  end
  if $type == "F-1"
    if result.include? "F1" or result.include? " Fl "
      $status = true
      puts "F1"
    end
  elsif $type == "J-1"
    if result.include? "J1" or result.include? " Jl "
      $status = true
      puts "J1"
    end
  end
  if result.include? "D/S" or result.include? "DIS"
    puts "D/S"
    $until = true
  end

  if result.include? $last_name
    $lname = true
    puts $last_name
  end

  if result.include? $first_name
    $fname = true
    puts $first_name
  end

end

def correct_pdf(file)
  begin
  PDF::Reader.open(file) do |reader|
    reader.pages.each do |page|
      text = page.text
      open("#{$current_path}log", "a") { |f|
        f.puts "\n"
        f.puts "\n"
        f.puts "===================="
        f.puts $last_name + ", " + $first_name
        f.puts text
        f.puts "===================="
        f.puts "\n"
        f.puts "\n"
      }
      spl = text.split("\n")
      date = ""
      cls = ""
      untl = ""
      last = ""
      first = ""
      for line in spl do
        if line.include? "Entry"
          entry_date = line
          puts entry_date
          if valid_date(entry_date)
            puts "entry"
            $entry = true
          end
        end
        if line.include? "Class"
          class_adm = line
          if $type == "F-1"
            if class_adm.include? "F1"
              $status = true
              puts "class"
            end
          elsif $type == "J-1"
            if class_adm.include? "J1"
              $status = true
              puts "class"
            end
          end
        end
        if line.include? "Admit"
          adm_until = line
          if adm_until.include? "D/S"
            puts "adm_until"
            $until = true
          end
        end
        if line.include? "Last/Surname"
          last_name = line
          if last_name.include? $last_name
            $lname = true
            puts "last"
          end
        end
        if line.include? "First"
          first_name = line
          if first_name.include? $first_name
            $fname = true
            puts "first"
          end
        end
      end
    end
  end

  rescue
  end
end

def accept(file, img_result, pdf_result)
  $entry = false
  $until = false
  $status = false
  $lname = false
  $fname = false
  correct_pdf(file)
  #puts "entry: #{$entry} and class:#{$status} and until:#{$until} and lname:#{$lname} and fname:#{$fname}"
  correct_image(img_result)
  #puts "entry: #{$entry} and class:#{$status} and until:#{$until} and lname:#{$lname} and fname:#{$fname}"
  correct_image(pdf_result)
  puts "entry: #{$entry} and class:#{$status} and until:#{$until} and lname:#{$lname} and fname:#{$fname}"
  if $entry and $until and $status and $lname and $fname
    return true
  else
    return false
  end
end


def process()
  url = $browser.url
  page = $agent.get(url)
  $sid = $browser.label(:id => "lblSubmitterCampusID").text.split(":")[1].strip()
  #$uploadid = page.css("label")[10].text
  puts "SID: " + $sid
  name, $type = find_student($sid)
  puts $type
  if name == ""
    return
  end
  spl = name.split(",")
  print "spl"
  print spl
  print "spl.length"
  print spl.length
  if (spl.length != 2)
    return
  end
  $first_name = spl[1].strip().upcase
  $last_name = spl[0].strip().upcase

  #just first of names
  $last_name = $last_name.split()[0]
  $first_name = $first_name.split()[0]
  if ($last_name == nil or $first_name == nil)
    return
  end
  upload = $agent.get(url)
  button = upload.form.buttons[9]
  page = $agent.submit(upload.form, button)
  filename = $last_name + "_" + $first_name[0] + '.pdf'
  image = $last_name + "_" + $first_name[0] + '.jpg'
  File.open(image, 'wb'){|f| f << page.body}
  File.open(filename, 'wb'){|f| f << page.body}
  filepath = $current_path + filename
  img_file = $current_path + image
  begin
  img_result = $resource.clean_convert file: img_file
  rescue
    img_result = ""
  end
  begin
  pdf_result = $resource.clean_convert file: filepath
  rescue
    pdf_result = ""
  end
  if accept(filepath, img_result, pdf_result)
    $accepted += 1
    puts "Accepted " + $last_name + "," + $first_name
    #$browser.select_list(:id, "ddlStatus").select_value('2')
    #$browser.wait_until {$browser.element(:id, "ddlStatus").text != info_line}
  end
end

$browser = Watir::Browser.new
$browser.goto("https://io.berkeley.edu")
$browser.input(name: 'username').send_keys(id)
$browser.input(name: 'password').send_keys(pwd)
$browser.input(value: 'Sign In').click
$browser.goto($link)
process()
