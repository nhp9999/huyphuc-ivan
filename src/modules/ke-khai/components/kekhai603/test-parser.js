// Test parser function for Excel data with empty cells and blank lines

const testData = `8924992285	12	1
		
8923487321		
8922622809		
8923468288		
8923406406		
8923440017	12	4
8923297416		
		
		
8923427349		
8923427347		
8923431836		
8924833866		
8923461385	12	4
		
8923514024	12	2
7413266839	12	3
8925473500		
8923432472		
		
7932649497		
7423138100		
7423132056		
7928325728	12	2
8923428081		`;

function parseInputText(text, doiTuongThamGia = 'TM') {
  const allLines = text.split('\n');
  const results = [];
  const errors = [];
  let processedLineCount = 0;

  // Detect format for user feedback
  let formatDetected = '';
  const nonEmptyLines = allLines.filter(line => line.trim());
  if (nonEmptyLines.length > 0) {
    const firstLine = nonEmptyLines[0];
    if (firstLine.includes('\t')) {
      formatDetected = 'Excel (Tab-separated)';
    } else if (firstLine.includes(',')) {
      formatDetected = 'Comma-separated';
    } else if (firstLine.includes(' ')) {
      formatDetected = 'Space-separated';
    } else {
      formatDetected = 'Chỉ mã BHXH';
    }
  }

  allLines.forEach((line, originalIndex) => {
    const trimmedLine = line.trim();
    
    // Skip completely empty lines
    if (!trimmedLine) return;
    
    // Skip lines that only contain whitespace or tabs
    if (/^\s*$/.test(line)) return;

    processedLineCount++;

    let parts;
    if (trimmedLine.includes('\t')) {
      // Excel tab-separated format - split by tabs and clean up
      parts = trimmedLine.split('\t').map(p => p.trim());
    } else {
      // Other formats (comma, space, mixed)
      parts = trimmedLine.split(/[,\s]+/).map(p => p.trim()).filter(p => p);
    }
    
    // Get the first non-empty part as BHXH code
    const bhxhPart = parts.find(p => p && p.trim());
    if (!bhxhPart) return; // Skip if no valid data found

    // Extract BHXH code (remove any non-digits)
    const maSoBHXH = bhxhPart.replace(/\D/g, '');
    
    // Validate BHXH code
    if (maSoBHXH.length !== 10) {
      errors.push(`Dòng ${originalIndex + 1}: Mã BHXH không hợp lệ (${bhxhPart}) - cần đúng 10 chữ số`);
      return;
    }

    const data = { maSoBHXH };
    let hasValidData = false; // Track if this row has sufficient data

    // For tab-separated format, handle empty cells properly
    if (trimmedLine.includes('\t')) {
      // Parse months from second column (index 1)
      if (parts.length > 1 && parts[1] && parts[1].trim()) {
        const months = parts[1].trim().replace(/\D/g, '');
        if (['3', '6', '12'].includes(months)) {
          data.soThangDong = months;
          hasValidData = true; // Has months data
        } else if (months) {
          errors.push(`Dòng ${originalIndex + 1}: Số tháng không hợp lệ (${parts[1]}). Chỉ chấp nhận 3, 6, hoặc 12`);
          return; // Skip this row due to invalid data
        }
      }

      // Parse STT hộ from third column (index 2) - only if not DS type
      if (parts.length > 2 && parts[2] && parts[2].trim() && doiTuongThamGia && !doiTuongThamGia.includes('DS')) {
        const sttHoRaw = parts[2].trim();

        // Handle STT hộ: 1, 2, 3, 4 stay as is; 5 and above become "5+"
        if (['1', '2', '3', '4'].includes(sttHoRaw)) {
          data.sttHo = sttHoRaw;
          hasValidData = true; // Has STT hộ data
        } else if (sttHoRaw === '5+') {
          data.sttHo = '5+';
          hasValidData = true; // Has STT hộ data
        } else {
          // Check if it's a number >= 5
          const sttHoNum = parseInt(sttHoRaw);
          if (!isNaN(sttHoNum) && sttHoNum >= 5) {
            data.sttHo = '5+'; // Convert 5, 6, 7, etc. to "5+"
            hasValidData = true; // Has STT hộ data
          } else {
            errors.push(`Dòng ${originalIndex + 1}: STT hộ không hợp lệ (${sttHoRaw}). Chỉ chấp nhận 1, 2, 3, 4, hoặc từ 5 trở lên (sẽ chuyển thành 5+)`);
            return; // Skip this row due to invalid data
          }
        }
      }
    } else {
      // For other formats, parse sequentially from non-empty parts
      const nonEmptyParts = parts.filter(p => p && p.trim());

      // Parse months if provided
      if (nonEmptyParts.length > 1) {
        const months = nonEmptyParts[1].replace(/\D/g, '');
        if (['3', '6', '12'].includes(months)) {
          data.soThangDong = months;
          hasValidData = true; // Has months data
        } else if (months) {
          errors.push(`Dòng ${originalIndex + 1}: Số tháng không hợp lệ (${nonEmptyParts[1]}). Chỉ chấp nhận 3, 6, hoặc 12`);
          return; // Skip this row due to invalid data
        }
      }

      // Parse STT hộ if provided (and not DS type)
      if (nonEmptyParts.length > 2 && doiTuongThamGia && !doiTuongThamGia.includes('DS')) {
        const sttHoRaw = nonEmptyParts[2].trim();

        // Handle STT hộ: 1, 2, 3, 4 stay as is; 5 and above become "5+"
        if (['1', '2', '3', '4'].includes(sttHoRaw)) {
          data.sttHo = sttHoRaw;
          hasValidData = true; // Has STT hộ data
        } else if (sttHoRaw === '5+') {
          data.sttHo = '5+';
          hasValidData = true; // Has STT hộ data
        } else {
          // Check if it's a number >= 5
          const sttHoNum = parseInt(sttHoRaw);
          if (!isNaN(sttHoNum) && sttHoNum >= 5) {
            data.sttHo = '5+'; // Convert 5, 6, 7, etc. to "5+"
            hasValidData = true; // Has STT hộ data
          } else {
            errors.push(`Dòng ${originalIndex + 1}: STT hộ không hợp lệ (${sttHoRaw}). Chỉ chấp nhận 1, 2, 3, 4, hoặc từ 5 trở lên (sẽ chuyển thành 5+)`);
            return; // Skip this row due to invalid data
          }
        }
      }
    }

    // For DS type, only require months data (STT hộ is automatically set to "1")
    if (doiTuongThamGia && doiTuongThamGia.includes('DS')) {
      if (data.soThangDong) {
        data.sttHo = '1'; // Auto-set STT hộ to "1" for DS type
        hasValidData = true;
      }
    }

    // Only add to results if the row has sufficient data (months and/or STT hộ)
    if (hasValidData) {
      results.push(data);
    }
    // Skip rows that only have BHXH code without additional data
  });

  return {
    results,
    errors,
    formatDetected: `${formatDetected} - Đã xử lý ${results.length} mã BHXH từ ${processedLineCount} dòng có dữ liệu`,
    totalLines: allLines.length,
    processedLines: processedLineCount,
    validResults: results.length
  };
}

// Test the function
console.log('Testing Excel data parsing...');
const result = parseInputText(testData);

console.log('\n=== RESULTS ===');
console.log('Format detected:', result.formatDetected);
console.log('Total lines:', result.totalLines);
console.log('Processed lines:', result.processedLines);
console.log('Valid results:', result.validResults);
console.log('Errors:', result.errors.length);

if (result.errors.length > 0) {
  console.log('\n=== ERRORS ===');
  result.errors.forEach(error => console.log(error));
}

console.log('\n=== SAMPLE RESULTS ===');
result.results.slice(0, 10).forEach((item, index) => {
  console.log(`${index + 1}. BHXH: ${item.maSoBHXH}, Months: ${item.soThangDong || 'N/A'}, STT: ${item.sttHo || 'N/A'}`);
});

console.log('\n=== SUMMARY ===');
const withMonths = result.results.filter(r => r.soThangDong).length;
const withSTT = result.results.filter(r => r.sttHo).length;
console.log(`- Có số tháng: ${withMonths}/${result.validResults}`);
console.log(`- Có STT hộ: ${withSTT}/${result.validResults}`);
console.log(`- Chỉ mã BHXH: ${result.validResults - withMonths}/${result.validResults}`);
