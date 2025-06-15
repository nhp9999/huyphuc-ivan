**TÀI LIỆU MÔ TẢ ĐẦU HÀM TÍCH HỢP HÓA ĐƠN ĐIỆN TỬ**

| Phiên bản tài liệu | 1.0 |
| --- | --- |

Mục Lục

[1\. QUY ĐỊNH VÀ CHUẨN CHUNG 6](#_Toc106724425)

[1.1. Chuẩn định dạng dữ liệu trả về 6](#_Toc106724426)

[1.2. Base64 format 6](#_Toc106724427)

[1.3. Errors 6](#_Toc106724428)

[2\. Danh sách các hàm tích hợp 7](#_Toc106724429)

[2.1. Nhóm các hàm webservice tạo lập và phát hành hóa đơn (PublishService) 7](#_Toc106724430)

[2.1.1. Phát hành hóa đơn 7](#_Toc106724431)

[2.1.2. Phát hành hóa đơn theo số hóa đơn truyền vào 10](#_Toc106724432)

[2.1.3. Phát hành hóa đơn theo danh sách fkey truyền vào 14](#_Toc106724433)

[2.1.4. Phát hành hóa đơn theo khoảng thời gian (publishdate) 16](#_Toc106724434)

[2.1.5. Lấy giá trị Hash cho phát hành hóa đơn token ( bước 1) 17](#_Toc106724435)

[2.1.6. Phát hành hóa đơn sử dụng token (bước 2) 19](#_Toc106724436)

[2.1.7. Thay thế, điều chỉnh hóa đơn sử dụng token 21](#_Toc106724437)

[2.1.8. Thêm mới hóa đơn theo mẫu số, ký hiệu 23](#_Toc106724438)

[2.1.9. Cập nhật dữ liệu khách hàng 27](#_Toc106724439)

[2.1.10. Xóa hóa đơn chưa phát hành theo danh sách fkey 28](#_Toc106724440)

[2.1.11. Thêm mới hóa đơn 29](#_Toc106724441)

[2.1.12. Gửi lại email thông báo hóa đơn phát hành 35](#_Toc106724442)

[2.1.13. Lấy thông tin chứng thư số hiện tại của đơn vị 37](#_Toc106724443)

[2.1.14. Cập nhật loại hình ký số và chứng thư số 38](#_Toc106724444)

[2.1.15. Xóa chứng thư số 39](#_Toc106724445)

[2.1.16. Danh sách chứng thư số của đơn vị 39](#_Toc106724446)

[2.1.17. Thay đổi mật khẩu 40](#_Toc106724447)

[2.2. Nhóm các hàm webservice liên quan đến tra cứu hóa đơn ( PortalService) 41](#_Toc106724448)

[2.2.1. Download hóa đơn 42](#_Toc106724449)

[2.2.2. Download hóa đơn với cả các hóa đơn chưa thanh toán 42](#_Toc106724450)

[2.2.3. Download hóa đơn theo Fkey 42](#_Toc106724451)

[2.2.4. Download hóa đơn theo fkey, không kiểm tra trạng thái thanh toán 42](#_Toc106724452)

[2.2.5. Download hóa đơn mới tạo theo Fkey định dạng Pdf 42](#_Toc106724453)

[2.2.6. Download hóa đơn định dạng Pdf 42](#_Toc106724454)

[2.2.7. Download hóa đơn định dạng Pdf, không kiểm tra trạng thái thanh toán 42](#_Toc106724455)

[2.2.8. Lấy danh sách hóa đơn từ số, đến số 42](#_Toc106724456)

[2.2.9. Tìm kiếm hóa đơn theo khách hàng 42](#_Toc106724457)

[2.2.10. Tìm kiếm hóa đơn theo fkey 42](#_Toc106724458)

[2.2.11. Lấy thông tin chi tiết hóa đơn 42](#_Toc106724459)

[2.2.12. Lấy thông tin chi tiết hóa đơn, không kiểm tra trạng thái thanh toán 42](#_Toc106724460)

[2.2.13. Lấy thông tin chi tiết hóa đơn theo fkey 42](#_Toc106724461)

[2.2.14. Lấy thông tin chi tiết hóa đơn tạo mới theo fkey 42](#_Toc106724462)

[2.2.15. Lấy thông tin chi tiết của hóa đơn theo fkey, không kiểm tra trạng thái thanh toán 42](#_Toc106724463)

[2.2.16. Chuyển đổi hóa đơn chứng minh nguồn gốc, xuất xứ 42](#_Toc106724464)

[2.2.17. Chuyển đổi hóa đơn chứng minh nguồn gốc, xuất xử theo fkey 42](#_Toc106724465)

[2.2.18. Chuyển đổi lưu trữ hóa đơn 42](#_Toc106724466)

[2.2.19. Lấy thông tin khách hàng 42](#_Toc106724467)

[2.2.20. Chuyển đổi lưu trữ hóa đơn theo Fkey 42](#_Toc106724468)

[2.2.21. Download hóa đơn lỗi gửi thuế theo Fkey 42](#_Toc106724469)

[2.2.22. Download hóa đơn lỗi gửi cơ quan thuế định dạng Pdf theo token 42](#_Toc106724470)

[2.2.23. Download hóa đơn lỗi gửi cơ quan thuế định dạng HTML 42](#_Toc106724471)

[2.2.24. Download hóa đơn lỗi gửi thuế định dạng Pdf theo Fkey 42](#_Toc106724472)

[2.2.25. Download hóa đơn lỗi gửi cơ quan thuế theo invtoken 42](#_Toc106724473)

[2.2.26. Download hóa đơn lỗi gửi cơ quan thuế với cả các hóa đơn chưa thanh toán theo invtoken 42](#_Toc106724474)

[2.2.27. Download hóa đơn lỗi gửi thuế định dạng Pdf, không kiểm tra trạng thái thanh toán theo fkey 42](#_Toc106724475)

[2.2.28. Download hóa đơn lỗi gửi thuế định dạng Pdf, không kiểm tra trạng thái thanh toán theo Token 42](#_Toc106724476)

[2.2.29. Lấy danh sách hóa đơn từ ngày đến ngày theo mẫu số, ký hiệu 42](#_Toc106724477)

[2.3. Nhóm các hàm webservice xử lý hóa đơn ( BussinessService) 41](#_Toc106724478)

[2.3.1. Gạch nợ hóa đơn theo fkey 42](#_Toc106724479)

[2.3.2. Gạch nợ hóa đơn 42](#_Toc106724480)

[2.3.3. Bỏ gạch nợ hóa đơn theo fkey 42](#_Toc106724481)

[2.3.4. Bỏ gạch nợ hóa đơn 42](#_Toc106724482)

[2.3.5. Điều chỉnh hóa đơn 42](#_Toc106724483)

[2.3.6. Điều chỉnh hóa đơn theo số hóa đơn truyền vào 42](#_Toc106724484)

[2.3.7. Html xem trước khi điều chỉnh hóa đơn 42](#_Toc106724485)

[2.3.8. Hủy hóa đơn theo fkey 42](#_Toc106724486)

[2.3.9. Thay thế hóa đơn 42](#_Toc106724487)

[2.3.10. Thay thế hóa đơn theo số hóa đơn truyền vào 42](#_Toc106724488)

[2.3.11. Html xem trước khi thay thế hóa đơn 42](#_Toc106724489)

[2.3.12. Hủy hóa đơn theo fkey 42](#_Toc106724490)

[2.3.13. Hủy hóa đơn không check trạng thái thanh toán 42](#_Toc106724491)

[2.3.14. Gạch nợ hóa đơn theo fkey 42](#_Toc106724492)

[2.3.15. Phân phối hóa đơn 42](#_Toc106724493)

[2.3.16. Đính kèm file bảng kê cho hóa đơn theo số hóa đơn 42](#_Toc106724494)

[2.3.17. Dowload file bảng kê của hóa đơn theo Fkey 42](#_Toc106724495)

[2.3.18. Điều chỉnh nhiều hóa đơn 42](#_Toc106724496)

[2.3.19. Khôi phục hóa đơn đã hủy Fkey 42](#_Toc106724497)

[2.3.20. Khôi phục hóa đơn đã hủy Token 42](#_Toc106724498)

[2.3.21. Khôi phục hóa đơn bị thay thế bằng FKey 42](#_Toc106724499)

[2.3.22. Khôi phục hóa đơn bị thay thế bằng Token 42](#_Toc106724500)

[3\. Danh sách các hàm tích hợp thông tư 78 42](#_Toc106724501)

[3.1. Nhóm các hàm webservice tạo lập và phát hành hóa đơn (PublishService) 42](#_Toc106724502)

[3.1.1. Phát hành hóa đơn 42](#_Toc106724503)

[3.1.2. Phát hành hóa đơn theo số hóa đơn truyền vào 42](#_Toc106724504)

[3.1.3. Thêm mới hóa đơn 42](#_Toc106724505)

[3.1.4. Thêm mới hóa đơn theo mẫu số, ký hiệu 42](#_Toc106724506)

[3.1.5. Lấy nội dung XMLData Hóa đơn có mã CQT trả về 42](#_Toc106724507)

[3.1.6. Lấy trạng thái và XMLData hóa đơn có mã, trạng thái của hóa đơn không mã gửi CQT trả về theo danh sách invToken 42](#_Toc106724508)

[3.1.7. Lấy trạng thái và XMLData hóa đơn có mã, trạng thái của hóa đơn không mã gửi CQT trả về theo danh sách Fkey 42](#_Toc106724509)

[3.1.8. Lấy trạng thái hóa đơn có mã, hóa đơn không mã gửi CQT trả về theo danh sách invToken 42](#_Toc106724510)

[3.1.9. Lấy trạng thái hóa đơn có mã, hóa đơn không mã gửi CQT trả về theo danh sách Fkey 42](#_Toc106724511)

[3.1.10. Gửi thông điệp hóa đơn điện tử có sai sót. 42](#_Toc106724512)

[3.1.11. Lấy giá trị Hash cho gửi thông điệp hóa đơn có sai sót bằng token ( bước 1) 42](#_Toc106724513)

[3.1.12. Gửi thông điệp hóa đơn điện tử có sai sót sử dụng token (bước 2) 42](#_Toc106724514)

[3.1.13. Lấy giá trị Hash cho gửi thông điệp hóa đơn có sai sót bằng SmartCA ( bước 1) 42](#_Toc106724515)

[3.1.14. Gửi thông điệp hóa đơn điện tử có sai sót sử dụng SmartCA (bước 2) 42](#_Toc106724516)

[3.1.15. Nhận kết quả thông điệp hóa đơn sai sót 42](#_Toc106724517)

[3.1.16. Xử lý kêt quả thông điệp hóa đơn sai sót 42](#_Toc106724518)

[3.1.17. Lấy danh sách lịch sử truyền nhận CQT theo tham số truyền vào và phân trang 42](#_Toc106724519)

[3.1.18. Xem chi tiết bản ghi trong lịch sử truyền nhận 42](#_Toc106724520)

[3.1.19. Xem chi tiết step CQT trả về 43](#_Toc106724521)

[3.1.20. Nhận kết quả lịch sự truyền nhận 43](#_Toc106724522)

[3.1.21. Đăng ký tờ khai DK01 44](#_Toc106724523)

[3.1.22. Lấy kết quả tờ khai DK01 44](#_Toc106724524)

[3.1.23. Đăng ký dải số 44](#_Toc106724525)

[3.1.24. Hủy dải số 44](#_Toc106724526)

[3.1.25. Lấy giá trị Hash cho phát hành hóa đơn SmartCa ( bước 1) 44](#_Toc106724527)

[3.1.26. Phát hành hóa đơn sử dụng SmartCA (bước 2) 44](#_Toc106724528)

[3.1.27. In thông báo hóa đơn sai sót 44](#_Toc106724529)

[3.2. Nhóm các hàm webservice xử lý hóa đơn (BussinessService) 45](#_Toc106724530)

[3.2.1. Điều chỉnh hóa đơn theo số hóa đơn truyền vào 45](#_Toc106724531)

[3.2.2. Html xem trước khi điều chỉnh hóa đơn 49](#_Toc106724532)

[3.2.3. Thay thế hóa đơn theo số hóa đơn truyền vào 52](#_Toc106724533)

[3.2.4. Html xem trước khi thay thế hóa đơn 55](#_Toc106724534)

[3.2.5. Thay thế hóa đơn giữ số khác mẫu số 58](#_Toc106724535)

[3.2.6. Thay thế hóa đơn theo fkey, pattern, serial truyền vào 62](#_Toc106724536)

[3.2.7. Điều chỉnh hóa đơn theo fkey, pattern, serial truyền vào 65](#_Toc106724537)

[3.2.8. Điều chỉnh hóa đơn cũ (hóa đơn không tồn tại trên hệ thống) 69](#_Toc106724538)

[3.2.9. Thay thế hóa đơn cũ (hóa đơn không tồn tại trên hệ thống) 73](#_Toc106724539)

[3.2.10. Điều chỉnh hóa đơn không phát sinh hóa đơn mới 78](#_Toc106724540)

[3.2.11. lấy giá trị Hash cho điều chỉnh thay thế hóa đơn cũ token Smart CA(Bước 1) 79](#_Toc106724541)

[3.2.12. Gửi điều chỉnh, thay thế hóa đơn cũ sử dụng token smart CA (Bước 2) 82](#_Toc106724542)

[3.2.13. Lấy giá trị Hash cho điều chỉnh thay thế không tồn tại hóa đơn cũ với Smart CA(Bước 1) 84](#_Toc106724543)

[3.2.14. Gửi điều chỉnh, thay thế không tồn tại hóa đơn cũ với smart CA (Bước 2) 86](#_Toc106724544)

[3.2.15. Lấy giá trị Hash cho điều chỉnh thay thế không tồn tại hóa đơn cũ với Token(Bước 1) 88](#_Toc106724545)

[3.2.16. Gửi điều chỉnh, thay thế không tồn tại hóa đơn cũ với Token (Bước 2) 90](#_Toc106724546)

[3.2.17. Thay thế, điều chỉnh hóa đơn sử dụng SmartCa (bước 2) 93](#_Toc106724547)

[3.2.18. Lấy thông tin config 95](#_Toc106724548)

# QUY ĐỊNH VÀ CHUẨN CHUNG

## Chuẩn định dạng dữ liệu trả về

Dữ liệu message được trao đổi qua Web Service theo định dạng XML.

## Base64 format

Một dạng khác để truyền dữ liệu binary dưới dạng text là dạng Base64 Encoding.

[http://en.wikipedia.org/wiki/Base64](http://en.wikipedia.org/wiki/Base64)

## Errors

Các lỗi trả về theo bảng mô tả mã lỗi tương ứng mỗi đầu hàm.

# Danh sách các hàm tích hợp

## Nhóm các hàm webservice tạo lập và phát hành hóa đơn (PublishService)

**Mô tả: các đầu hàm web service nằm trong PublishService.asmx, thực hiện các nghiệp vụ liên quan đến tạo lập, phát hành và xử lý hóa đơn**

### Phát hành hóa đơn

URL

String **ImportAndPublishInv**(string Account, string ACpass, string xmlInvData, string username, string password, string pattern = "", string serial = "", int convert = 0).

DESCRIPTION

Đây là web service cho phép phát hành hóa đơn với dữ liệu XML của khách hàng, tối đa cho 5000 hóa đơn.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: Chuỗi XML dữ liệu hóa đơn ( theo cấu trúc mô tả)
*   **pattern:** Mẫu số hóa đơn
*   **serial:** Ký hiệu hóa đơn
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định | Hệ thống sẽ trả về lỗi nếu 1 hóa đơn trong chuỗi XML đầu vào không hợp lệ, cả lô hóa đơn sẽ không được phát hành. |
| ERR:7 | Thông tin về Username/pass không hợp lệ |  |
| ERR:20 | Pattern và Serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng kí có sử dụng Pattern và Serial truyền vào. |  |
| ERR:5 | Không phát hành được hóa đơn | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| ERR:10 | Lô có số hóa đơn vượt quá số lượng cho phép |  |
| ERR:6 | Dải hóa đơn không đủ số hóa đơn cho lô phát hành |  |
| ERR:13 | Lỗi trùng fkey | 1 hoặc nhiều hóa đơn trong lô hóa đơn có Fkey trùng với Fkey của hóa đơn đã phát hành |
| ERR:21 | Lỗi trùng số hóa đơn |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| OK:pattern;serial1-key1_num1,key2_num12, …)(Ví dụ:OK:01GTKT3/001;AA/12E-key1_1,key2_2,key3_3,key4_4,key5_5) | OK 🡪 đã phát hành hóa đơn thành côngPattern 🡪 Mẫu số của các hóa đơn đã phát hànhSerial1 🡪 serial của dãy các hóa đơn phát hànhnum1, num2… là các số hóa đơnkey1,key2… là khóa để nhận biết hóa đơn phát hành cho khách hàng nào(lấy từ đầu vào) | Các hóa đơn có serial khác nhau phân cách bởi dấu “;”Các số hóa đơn phân cách bởi “,” |

Cấu trúc xmlInvData

<Invoices>

<Inv>

<key>**Giá trị khóa để phân biệt hóa đơn xuất cho khách hàng nào**</key>

<Invoice>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod>**Phương thức thanh toán**</PaymentMethod>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<Products>

<Product>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền sau thuế\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue> **GrossValue** </GrossValue>

<GrossValue0> **GrossValue0**</GrossValue0>

<VatAmount0> **VatAmount0**</VatAmount0>

<GrossValue5> **GrossValue5**</GrossValue5>

<VatAmount5> **VatAmount5**</VatAmount5>

<GrossValue10> **GrossValue10**</GrossValue10>

<VatAmount10> **VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</Invoice>

</Inv>

</Invoices>

### Phát hành hóa đơn theo số hóa đơn truyền vào

URL

String **ImportAndPublishAssignedNo**(string Account, string ACpass, string xmlInvData, string username, string password, string pattern = "", string serial = "", int convert = 0).

DESCRIPTION

Đây là web service cho phép phát hành hóa đơn với dữ liệu XML của khách hàng cho phép truyền số hóa đơn khi phát hành, tối đa cho 5000 hóa đơn.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: Chuỗi XML dữ liệu hóa đơn ( theo cấu trúc mô tả)
*   **pattern:** Mẫu số hóa đơn
*   **serial:** Ký hiệu hóa đơn
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định | Hệ thống sẽ trả về lỗi nếu 1 hóa đơn trong chuỗi XML đầu vào không hợp lệ, cả lô hóa đơn sẽ không được phát hành. |
| ERR:7 | Thông tin về Username/pass không hợp lệ |  |
| ERR:20 | Pattern và Serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng kí có sử dụng Pattern và Serial truyền vào. |  |
| ERR:5 | Không phát hành được hóa đơn | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| ERR:10 | Lô có số hóa đơn vượt quá số lượng cho phép |  |
| ERR:6 | Dải hóa đơn không đủ số hóa đơn cho lô phát hành |  |
| ERR:13 | Lỗi trùng fkey | 1 hoặc nhiều hóa đơn trong lô hóa đơn có Fkey trùng với Fkey của hóa đơn đã phát hành |
| ERR:21 | Lỗi trùng số hóa đơn |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:31 | Số hóa đơn truyền vào không hợp lệ |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| OK:pattern;serial1-key1_num1,key2_num12, …)(Ví dụ:OK:01GTKT3/001;AA/12E-key1_1,key2_2,key3_3,key4_4,key5_5) | OK 🡪 đã phát hành hóa đơn thành côngPattern 🡪 Mẫu số của các hóa đơn đã phát hànhSerial1 🡪 serial của dãy các hóa đơn phát hànhnum1, num2… là các số hóa đơnkey1,key2… là khóa để nhận biết hóa đơn phát hành cho khách hàng nào(lấy từ đầu vào) | Các hóa đơn có serial khác nhau phân cách bởi dấu “;”Các số hóa đơn phân cách bởi “,” |

Cấu trúc xmlInvData

<Invoices>

<Inv>

<key>**Giá trị khóa để phân biệt hóa đơn xuất cho khách hàng nào**</key>

<Invoice>

<InvoiceNo>**Số hóa đơn\***</InvoiceNo>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod>**Phương thức thanh toán**</PaymentMethod>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<Products>

<Product>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền sau thuế\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue> **GrossValue** </GrossValue>

<GrossValue0> **GrossValue0**</GrossValue0>

<VatAmount0> **VatAmount0**</VatAmount0>

<GrossValue5> **GrossValue5**</GrossValue5>

<VatAmount5> **VatAmount5**</VatAmount5>

<GrossValue10> **GrossValue10**</GrossValue10>

<VatAmount10> **VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</Invoice>

</Inv>

</Invoices>

### Phát hành hóa đơn theo danh sách fkey truyền vào

URL

string **PublishInvFkey**(string Account, string ACpass, string lsFkey, string username, string password, string pattern = "", string serial = "").

DESCRIPTION

Đây là web service cho phép phát hành hóa đơn theo 1 danh sách fkey truyền vào, tối đa 200 fkey

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **lsFkey:** Danh sách Fkey truyền vào được ngăn cách bởi dấu “\_”
*   **pattern:** Mẫu số hóa đơn
*   **serial:** Ký hiệu hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền phát hành hóa đơn |  |
| ERR:6 | Danh sách Fkey không tồn tại |  |
| ERR:15 | Danh sách Fkey đã phát hành |  |
| ERR:20 | Pattern và Serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng kí có sử dụng Pattern và Serial truyền vào | Chỉ chấp nhận đồng thời nhập cả Pattern và Serial hoặc đồng thời để trống cả Pattern và Serial |
| ERR:5 | Không phát hành được hóa đơn | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| ERR:10 | Danh sách Fkey truyền vào vượt quá 200 fkey |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| OK:#Fkey1 _No1, Fkey2_No2(Ví dụ: OK:#Fkey1 _1, Fkey2_2) | OK 🡪 đã phát hành hóa đơn thành côngFkey1: Fkey thứ nhấtNo1: Số hóa đơn thứ 1 |  |

**Cấu trúc của file XML (các trường \* là bắt buộc):**

<PublishInvFkey>

<Account>**Tài khoản \***</Account>

<ACpass>**Mật khẩu \***</ACpass>

<lsFkey>**fkey1\_fkey2\_fkey3 \***</lsFkey>

<username>**Tài khoản role service \***</username>

<password>**Mật khẩu tài khoản role service \***</password>

<pattern>**Mẫu số**</pattern>

<serial>**Ký hiệu**</serial>

</PublishInvFkey>

### Phát hành hóa đơn theo khoảng thời gian (publishdate)

URL

string PublishInvByDate(string Account, string ACpass, string username, string password, string FromDate, string ToDate)

DESCRIPTION

Đây là web service cho phép phát hành hóa đơn theo 1 khoảng thời gian truyền vào.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **FromDate:** Ngày bắt đầu (so sánh với trường publishdate)
*   **ToDate:** Ngày kết thúc (so sánh với trường publishdate)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền phát hành hóa đơn |  |
| ERR:23 | Không tìm thấy thông tin công ty |  |
| ERR:24# | Không tìm thấy hóa đơn cần phát hành của công ty ứng với từng mẫu số, ký hiệu |  |
| ERR:14# | Không phát hành được hóa đơn của công ty ứng với từng mẫu số, ký hiệu |  |
| ERR:20 | Pattern và Serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng kí có sử dụng Pattern và Serial truyền vào | Chỉ chấp nhận đồng thời nhập cả Pattern và serial hoặc đồng thời để trống cả pattern và serial |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:5 | Không phát hành được hóa đơn | DB roll back |
| OK:#Fkey1 _No1, Fkey2_No2(Ví dụ: OK:#Fkey1 _1, Fkey2_2) | OK 🡪 đã phát hành hóa đơn thành côngFkey1: Fkey thứ nhấtNo1: Số hóa đơn thứ 1 |  |

**Cấu trúc của file XML (các trường \* là bắt buộc):**

<PublishInvByDate>

<Account>**Tài khoản \***</Account>

<ACpass>**Mật khẩu \***</ACpass>

<username>**Tài khoản role service \***</username>

<password>**Mật khẩu tài khoản role service \***</password>

<FromDate>**Ngày bắt đầu**</FromDate >

<ToDate>**Ngày kết thúc**</ToDate>

</PublishInvByDate >

### Lấy giá trị Hash cho phát hành hóa đơn token ( bước 1)

URL

string **getHashInvWithToken**(string Account, string ACpass, string xmlInvData, string username, string password, string serialCert, int type, string invToken, string pattern = "", string serial = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép phát hành hóa đơn với các hệ thống sử dụng token, thực hiện truyền dữ liệu hóa đơn và lấy giá trị hash value để ký số bằng token ở client.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml hóa đơn (theo mẫu mô tả kèm theo)
*   **serialCert**: Serial của chứng thư số công ty đã đăng ký trong hệ thống
*   **type**: phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4
*   **invToken**: chuỗi token hóa đơn = mẫu số;ký hiệu;số hóa đơn (ví dụ: 01GTKT0/001;AA/17E;1) – chỉ cần khi thay thế/ điều chỉnh; phát hành thì để trống
*   **pattern**: mẫu số hóa đơn
*   **serial**: ký hiệu hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và Serial không phù hợp |  |
| ERR:6 | Không còn đủ số lượng hóa đơn để phát hành |  |
| ERR:10 | Lô có số hóa đơn vượt quá số lượng tối đa cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| Chuỗi xml trả về | Chuỗi trả về |  |

Cấu trúc chuỗi XML trả về:

<Invoices>

<Inv>

<key>**123**</key>

<idInv>**128668**</idInv>

<hashValue>**rKdYgeYc7CYLOhjfNFDZ8nBaWjA=**</hashValue>

<pattern>**01GTKT0/001**</pattern>

<serial>**AA/17E**</serial>

</Inv>

<Inv>

<key>**456**</key>

<idInv>**128923**</idInv>

<hashValue>**2p60p82YQhqjMHG9t/toIaLfENQ=**</hashValue>

<pattern>**01GTKT0/001**</pattern>

<serial>**AA/17E**</serial>

</Inv>

</Invoices>

Trong đó: tag <key>: fkey

tag <idInv>: id hóa đơn trên hệ thống vnpt

tag <hashValue>: chuỗi hash

tag <pattern>: mẫu số

tag <serial>: ký hiệu

### Phát hành hóa đơn sử dụng token (bước 2)

URL

string **publishInvWithToken** (string Account, string ACpass, string xmlInvData, string username, string password, string pattern = "", string serial = "").

DESCRIPTION

Đây là web service cho phép phát hành hóa đơn với các hệ thống sử dụng token, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**2.1.4**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml dữ liệu ký hash hóa
*   **pattern**: mẫu số hóa đơn
*   **serial**: ký hiệu hóa đơn
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền phát hành hóa đơn |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải hóa đơn | Không tìm thấy dải hóa đơn hoặc tài khoản phát hành không có quyền phát hành hóa đơn trên dải hóa đơn truyền lên. |
| ERR:6 | Không còn đủ số lượng hóa đơn để phát hành |  |
| ERR:10 | Lô có số hóa đơn vượt quá max cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnhSerial 🡪 serial của hóa đơn điều chỉnhinvNumber: số hóa đơn điều chỉnh |  |

**Cấu trúc chuỗi xmlData truyền lên:**

<Invoices>

<SerialCert>540171AA56FDB2F8476BBD781251C83D</SerialCert>

<Inv>

<key>789</key>

<idInv>10</idInv>

<signValue>J2k7CsSN9Gb6PmsHD9yDJS1/j3s=</signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

tag <key>: fkey

tag <idInv>: id hóa đơn trên hệ thống vnpt

tag <signValue>: chuỗi ký

### Thay thế, điều chỉnh hóa đơn sử dụng token

URL

string **AdjustReplaceInvWithToken**(string Account, string ACpass, string xmlInvData, string username, string password, int type, string pattern = "", string serial = "")

DESCRIPTION

Đây là web service cho phép thay thế , điều chỉnh hóa đơn cho các khách hàng sử dụng token

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml hóa đơn ( theo mô tả)
*   **type**: thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4
*   **pattern**: mẫu số hóa đơn
*   **serial**: ký hiệu hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải hóa đơn | Không tìm thấy dải hóa đơn hoặc tài khoản phát hành không có quyền phát hành hóa đơn trên dải hóa đơn truyền lên. |
| ERR:6 | Không còn đủ số lượng hóa đơn để phát hành |  |
| ERR:10 | Lô có số hóa đơn vượt quá max cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnhSerial 🡪 serial của hóa đơn điều chỉnhinvNumber: số hóa đơn điều chỉnh |  |

**Cấu trúc xmlInvData**:

<Invoices>

<SerialCert> **serial chứng thư của công ty** </SerialCert>

<PatternOld> **mẫu số của hóa đơn bị điều chỉnh, thay thế** </PatternOld>

<SerialOld> **ký hiệu của hóa đơn bị điều chỉnh, thay thế** </SerialOld>

<NoOlde> **số hóa đơn của hóa đơn bị điều chỉnh, thay thế** </NoOlde>

<Inv>

<key> **fkey hóa đơn mới** </key>

<idInv> **id hóa đơn mới trên hệ thống vnpt** </idInv>

<signValue> **chuỗi ký** </signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

tag <PatternOld>: mẫu số của hóa đơn bị điều chỉnh, thay thế

tag <SerialOld>: ký hiệu của hóa đơn bị điều chỉnh, thay thế

tag <NoOlde>: số hóa đơn của hóa đơn bị điều chỉnh, thay thế

tag <key>: fkey hóa đơn mới

tag <idInv>: id hóa đơn mới trên hệ thống vnpt

tag <signValue>: giá trị ký số của hóa đơn mới

### Thêm mới hóa đơn theo mẫu số, ký hiệu

URL

string **ImportInvByPattern**(string Account, string ACpass, string xmlInvData, string username, string password, string pattern = "", string serial = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép thêm mới hóa đơn từ dữ liệu XML gửi lên

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml hóa đơn ( theo mô tả)
*   **pattern**: mẫu số hóa đơn
*   **serial**: ký hiệu hóa đơn
*   **convert:** Mặc định là 0, 0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:6 | Không đủ số lượng hóa đơn cho lô thêm mới |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:13 | Danh sách hóa đơn tồn tại hóa đơn trùng Fkey |  |
| ERR:22 | Trùng số hóa đơn |  |
| ERR:7 | Pattern và serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng ký có sử dụng Pattern và Serial truyền vào | Chỉ chấp nhận đồng thời nhập cả Pattern và serial hoặc đồng thời để trống cả pattern và serial |
| ERR:5 | Không phát hành được hóa đơn | Lỗi không xác định. DB roll back |
| ERR:10 | Lô có số hóa đơn vượt quá max cho phép | Mặc định là 5000, hoặc được cấu hình theo từng app |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| OK: pattern;serial1-key1_num1,key2_num12,key3_num3…(Ví dụ:OK:01GTKT3/001;AA/12E-key1_1,key2_2,key3_3,key4_4,key5_5) | OK 🡪 đã phát hành hóa đơn thành côngPattern 🡪 Mẫu số của các hóa đơn đã phát hànhSerial1 🡪 serial của dãy các hóa đơn phát hànhnum1, num2… là các số hóa đơnkey1,key2… là khóa để nhận biết hóa đơn phát hành cho khách hàng nào(lấy từ đầu vào) | Cách hóa đơn có serial khác nhau phân cách bởi dấu “;”Các số hóa đơn phân cách bởi “,” |

_Ghi chú:_

Kết quả trả về : Tiền tố ERR 🡪 có lỗi khi thực hiện hàm

Tiền tố OK 🡪 thực hiện phát hành hóa đơn thành công

Chỉ chấp nhận phát hành lô tối đa 5000 hóa đơn, hoặc cấu hình theo từng app.

**Cấu trúc XMLData, trường hợp không có các trường mở rộng** ( các trường \* là bắt buộc)

<Invoices>

<Inv>

<key>**Giá trị khóa để phân biệt hóa đơn xuất cho khách hàng nào**</key>

<Invoice>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod>**Phương thức thanh toán**</PaymentMethod>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<Products>

<Product>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

</Product>

</Products>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

</Invoice>

</Inv>

<Inv>**...**</Inv>

</Invoices>

**Cấu trúc XMLData, trường hợp có các trường mở rộng** ( các trường \* là bắt buộc)

<Invoices>

<Inv>

<key>**Giá trị khóa để phân biệt hóa đơn xuất cho khách hàng nào**</key>

<Invoice>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod>**Phương thức thanh toán**</PaymentMethod>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<Products>

<Product>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

</Product>

</Products>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extras>

<Extra\_item>

<Extra\_Name>**Name’s Extra**</Extra\_Name>

<Extra\_Value>**value’s Extra** </Extra\_Value>

</Extra\_item>

</Extras>

</Invoice>

</Inv>

<Inv>**...**</Inv>

</Invoices>

### Cập nhật dữ liệu khách hàng

URL

Int **UpdateCus** (string xmlCusData, string username, string pass, int? convert)

DESCRIPTION

Đây là web service cho phép cập nhật thông tin khách hàng

HTTP METHOD

POST

REQUEST BODY

*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlCusData**: chuỗi xml dữ liệu khách hàng ( theo mô tả)
*   **convert:** Mặc định là 0, 0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| -1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| -2 | Không import được khách hàng vào db | Có rollback db |
| -3 | Dữ liệu xml đầu vào không đúng quy định | Chỉ cần 1 customer trong chuỗi xml không hợp lệ, không thực hiện update trên tất cả dữ liệu đưa vào |
| N | Số lượng khách hàng đã import và update | N>0, N là kiểu integer |

**Cấu trúc của xmlCusData (các trường \* là bắt buộc):**

<Customers>

<Customer>

<Name>**Tên khách hàng\***</Name>

<Code>**Mã khách hàng\***</Code>

<Account>**Tài khoản đăng nhập**</Account>

<TaxCode>**Mã số thuế (bắt buộc với khách hàng là doanh nghiệp)**</TaxCode>

<Address>**Địa chỉthanh toán\***</Address>

<BankAccountName>**Tên tài khoản ngân hàng**</BankAccountName>

<BankName>**Tên ngân hàng**</BankName>

<BankNumber>**Số tài khoản**</BankNumber>

<Email>**Email**</Email>

<Fax>**Số fax**</Fax>

<Phone>**Điện thoại**</Phone>

<ContactPerson>**Liên hệ**</ContactPerson>

<RepresentPerson>**Người đại diện**</RepresentPerson>

<CusType>**Loại khách hàng (1: Doanh nghiệp/0: Cá nhân)\***</CusType>

<IsEmail>**Khách hàng nhận gửi mail khi phát hành hay không, 1: Có nhận/0: không nhận (Nếu không có thẻ này mặc định có nhận mail)**</IsEmail >

</Customer>

<Customer>**...**</Customer>

</Customers>

### Xóa hóa đơn chưa phát hành theo danh sách fkey

URL

string **deleteInvoiceByFkey**(string lstFkey, string username, string password, string Account, string ACpass)

DESCRIPTION

Đây là web service cho phép xóa 1 hoặc nhiều hóa đơn chưa phát hành theo danh sách fkey truyền vào.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **lstFkey**: danh sách fkey cần xóa bỏ, các Fkey phân biệt nhau bằng “\_”)

**VD:**012013\_022013\_032013

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai, hoặc không có quyền |  |
| ERR:7 | Không tìm thấy công ty |  |
| ERR:10 | Số hóa đơn truyền vào vượt quá số lượng cho phép | Mặc định 5000 hoặc theo cấu hình từng app |
| ERR:20 | Pattern và Serial không hợp lệ |  |
| ERR:5 | Lỗi không xác định |  |
| OK:fkey1,fkey2 | Xóa hóa đơn thành công | Trả về danh sách fkey các hóa đơn xóa thành công |

### Thêm mới hóa đơn

URL

string string **ImportInv**(string xmlInvData, string username, string password, int convert = 0)

DESCRIPTION

Đây là web service cho phép tạo mới hóa đơn từ chuỗi xml đầu vào theo chuẩn mô tả

HTTP METHOD

POST

REQUEST BODY

*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData:** Chuỗi xml chứa thông tin hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai |  |
| ERR:3 | Định dạng xml của hóa đơn sai cấu trúc |  |
| ERR:5 | Không tìm thấy công ty | Mặc định 5000 hoặc theo cấu hình từng app |
| ERR:20 | Pattern và serial không hợp lệ |  |
| ERR:6 | Không còn dư số hóa đơn để phát hành |  |
| ERR:10 | Vượt quá số lượng hóa đơn tạo cho phép (không được vượt quá 5000HĐ) |  |
| ERR:5 | Lỗi hệ thống |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| "OK:" + pattern + ";" + serial + "-" + invKeyList | Tạo hóa đơn thành công | Trả về message OK kèm theo Pattern, Serial và danh sách fkey hóa đơn tạo mới thành công |

**Định dạng chuỗi xml đầu vào, trường hợp không dùng các trường mở rộng**

<Invoices>

<Inv>

<key>**Fkey cua hoa don**</key>

<Invoice>

<CusCode>**Mã khách hàng**</CusCode>

<CusName>**Tên khách hàng**</CusName>

<CusAddress>**Địa chỉ KH**</CusAddress>

<CusPhone>**01678567028**</CusPhone>

<CusTaxCode>**0105762069-001**</CusTaxCode>

<PaymentMethod>**TM**</PaymentMethod>

<KindOfService>**072020**</KindOfService>

<Products>

<Product>

<ProdName>**Tên sản phẩm**</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**1**</ProdQuantity>

<ProdPrice>**2**</ProdPrice>

<Amount>**3**</Amount>

<Remark>**Remark**</Remark>

<Total>**4**</Total>

<VATRate>**50**</VATRate>

<VATAmount>**6**</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**7**</Discount>

<DiscountAmount>**8**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Total>**9**</Total>

<DiscountAmount>**10**</DiscountAmount>

<VATRate>**11**</VATRate>

<VATAmount>**12**</VATAmount>

<Amount>**13**</Amount>

<AmountInWords>**Số tiền viết bằng chữ**</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**15/07/2020**</ArisingDate>

<PaymentStatus>**1**</PaymentStatus>

<EmailDeliver>**kimnganhoa123@gmail.com**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**0105762069-002**</ComTaxCode>

<ComFax>**0462952034**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue0>**15**</GrossValue0>

<VatAmount0>**16**</VatAmount0>

<GrossValue5>**17**</GrossValue5>

<VatAmount5>**18**</VatAmount5>

<GrossValue10>**19**</GrossValue10>

<VatAmount10>**20**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**0462952033**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<GrossValue>**14**</GrossValue>

<CreateDate>**30/07/2020**</CreateDate>

<DiscountRate>**21**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax>**22**</GrossValue\_NonTax>

<CurrencyUnit>**USD**</CurrencyUnit>

<ExchangeRate>**23**</ExchangeRate>

<ConvertedAmount>**24**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

</Invoice>

</Inv>

<key></key>

<Invoice>

<CusCode></CusCode>

<CusName></CusName>

<CusAddress></CusAddress>

<CusPhone>**01678567028**</CusPhone>

<CusTaxCode>**0105762069-001**</CusTaxCode>

<PaymentMethod>**TM**</PaymentMethod>

<KindOfService>**072020**</KindOfService>

<Products>

<Product>

<ProdName>**Tên sản phẩm**</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**1**</ProdQuantity>

<ProdPrice>**2**</ProdPrice>

<Amount>**3**</Amount>

<Remark>**Remark**</Remark>

<Total>**4**</Total>

<VATRate>**50**</VATRate>

<VATAmount>**6**</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**7**</Discount>

<DiscountAmount>**8**</DiscountAmount>

<IsSum>**1**</IsSum>

</Product>

</Products>

<Total>**9**</Total>

<DiscountAmount>**10**</DiscountAmount>

<VATRate>**11**</VATRate>

<VATAmount>**12**</VATAmount>

<Amount>**13**</Amount>

<AmountInWords>**Số tiền viết bằng chữ**</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**15/07/2020**</ArisingDate>

<PaymentStatus>**1**</PaymentStatus>

<EmailDeliver>**kimnganhoa123@gmail.com**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**0105762069-002**</ComTaxCode>

<ComFax>**0462952034**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue>**14**</GrossValue>

<GrossValue0>**15**</GrossValue0>

<VatAmount0>**16**</VatAmount0>

<GrossValue5>**17**</GrossValue5>

<VatAmount5>**18**</VatAmount5>

<GrossValue10>**19**</GrossValue10>

<VatAmount10>**20**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**0462952033**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**30/07/2020**</CreateDate>

<DiscountRate>**21**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax>**22**</GrossValue\_NonTax>

<CurrencyUnit>**USD**</CurrencyUnit>

<ExchangeRate>**23**</ExchangeRate>

<ConvertedAmount>**24**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

</Invoice>

</Inv>

</Invoices>

**Định dạng chuỗi xml đầu vào, trường hợp có dùng thêm các trường mở rộng**

<Invoices>

<Inv>

<key>**Fkey cua hoa don**</key>

<Invoice>

<CusCode>**Mã khách hàng**</CusCode>

<CusName>**Tên khách hàng**</CusName>

<CusAddress>**Địa chỉ KH**</CusAddress>

<CusPhone>**01678567028**</CusPhone>

<CusTaxCode>**0105762069-001**</CusTaxCode>

<PaymentMethod>**TM**</PaymentMethod>

<KindOfService>**072020**</KindOfService>

<Products>

<Product>

<ProdName>**Tên sản phẩm**</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**1**</ProdQuantity>

<ProdPrice>**2**</ProdPrice>

<Amount>**3**</Amount>

<Remark>**Remark**</Remark>

<Total>**4**</Total>

<VATRate>**50**</VATRate>

<VATAmount>**6**</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**7**</Discount>

<DiscountAmount>**8**</DiscountAmount>

<IsSum>**1**</IsSum>

</Product>

</Products>

<Total>**9**</Total>

<DiscountAmount>**10**</DiscountAmount>

<VATRate>**11**</VATRate>

<VATAmount>**12**</VATAmount>

<Amount>**13**</Amount>

<AmountInWords>**Số tiền viết bằng chữ**</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<Extras>

<Extra\_item>

<Extra\_Name>**Name’s Extra**</Extra\_Name>

<Extra\_Value>**100**</Extra\_Value>

</Extra\_item>

</Extras>

<ArisingDate>**15/07/2020**</ArisingDate>

<PaymentStatus>**1**</PaymentStatus>

<EmailDeliver>**kimnganhoa123@gmail.com**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**0105762069-002**</ComTaxCode>

<ComFax>**0462952034**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue0>**15**</GrossValue0>

<VatAmount0>**16**</VatAmount0>

<GrossValue5>**17**</GrossValue5>

<VatAmount5>**18**</VatAmount5>

<GrossValue10>**19**</GrossValue10>

<VatAmount10>**20**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**0462952033**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<GrossValue>**14**</GrossValue>

<CreateDate>**30/07/2020**</CreateDate>

<DiscountRate>**21**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax>**22**</GrossValue\_NonTax>

<CurrencyUnit>**USD**</CurrencyUnit>

<ExchangeRate>**23**</ExchangeRate>

<ConvertedAmount>**24**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

</Invoice>

</Inv>

<key></key>

<Invoice>

<CusCode></CusCode>

<CusName></CusName>

<CusAddress></CusAddress>

<CusPhone>**01678567028**</CusPhone>

<CusTaxCode>**0105762069-001**</CusTaxCode>

<PaymentMethod>**TM**</PaymentMethod>

<KindOfService>**072020**</KindOfService>

<Products>

<Product>

<ProdName>**Tên sản phẩm**</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**1**</ProdQuantity>

<ProdPrice>**2**</ProdPrice>

<Amount>**3**</Amount>

<Remark>**Remark**</Remark>

<Total>**4**</Total>

<VATRate>**50**</VATRate>

<VATAmount>**6**</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**7**</Discount>

<DiscountAmount>**8**</DiscountAmount>

<IsSum>**1**</IsSum>

</Product>

</Products>

<Total>**9**</Total>

<DiscountAmount>**10**</DiscountAmount>

<VATRate>**11**</VATRate>

<VATAmount>**12**</VATAmount>

<Amount>**13**</Amount>

<AmountInWords>**Số tiền viết bằng chữ**</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**15/07/2020**</ArisingDate>

<PaymentStatus>**1**</PaymentStatus>

<EmailDeliver>**kimnganhoa123@gmail.com**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**0105762069-002**</ComTaxCode>

<ComFax>**0462952034**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue>**14**</GrossValue>

<GrossValue0>**15**</GrossValue0>

<VatAmount0>**16**</VatAmount0>

<GrossValue5>**17**</GrossValue5>

<VatAmount5>**18**</VatAmount5>

<GrossValue10>**19**</GrossValue10>

<VatAmount10>**20**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**0462952033**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**30/07/2020**</CreateDate>

<DiscountRate>**21**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax>**22**</GrossValue\_NonTax>

<CurrencyUnit>**USD**</CurrencyUnit>

<ExchangeRate>**23**</ExchangeRate>

<ConvertedAmount>**24**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

</Invoice>

</Inv>

</Invoices>

### Gửi lại email thông báo hóa đơn phát hành

URL

public string **SendAgainEmailServ**(string Account, string ACpass, string username, string password, string xmlDataInvoiceEmail, string hdPattern, string Serial)

DESCRIPTION

Đây là web service cho phép gửi lại email thông báo phát hành hóa đơn tới khách hàng

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên có quyền gửi mail
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlDataInvoiceEmail:** Thông tin hóa đơn cho nội dung gửi mail
*   **hdPattern**: Mẫu số hóa đơn
*   **Serial:** Ký hiệu hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai | Tài khoản đăng nhập sau hoặc không có quyền thực hiện tác vụ |
| ERR:21 | Không tìm được công ty, tài khoản không tồn tại |  |
| ERR:3 | Dữ liệu Pattern để trống |  |
| ERR:9 | Dữ liệu Serial để trống |  |
| ERR:8 | Dữ liệu Fkey để trống trong chuỗi xml gửi lên |  |
| ERR:10 | Số lượng fkey truyền vào lớn hơn giới hạn tối đa cho phép | Mặc định là 5000 hoặc theo cấu hình cho từng app |
| ERR:20 | Không tìm thấy thông báo phát hành hợp lệ |  |
| ERR:4 | Không tìm được hóa đơn để tạo và gửi lại mail |  |
| ERR:6 | Không tìm thấy câu hình IDeliver để tạo và gửi lại gửi mail |  |
| ERR:7 | Không gửi được email nào thành công |  |
| ERR:5 | Lỗi hệ thống |  |
| OK | Gửi thành công |  |

**Cấu trúc chuỗi xml gửi lên:**

<Invoices>

<Inv>

<Fkey>**Fkey1(\*)**</Fkey><EmailDeliver>**Email1 (\*)**</EmailDeliver>

<Fkey>**Fkey2(\*)**</Fkey><EmailDeliver>**Email2 (\*)**</EmailDeliver>

</Inv>

</Invoices>

### Lấy thông tin chứng thư số hiện tại của đơn vị

URL

String **GetCertInfo** (string userName, string password)

DESCRIPTION

Đây là web service lấy thông tin chứng thư số hiện tại của đơn vị.

HTTP METHOD

POST

REQUEST BODY

*   **userName/password**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| Chuỗi base64 | Chuỗi base64 trả về của chuỗi XML thông tin chứng thư |  |

Cấu trúc chuỗi XML trả về:

<Certificate>

<OwnCA><!\[CDATA\[\]\]></OwnCA>

<SerialNumber></SerialNumber>

<ValidFrom>**dd/MM/yyyy**</ValidFrom>

<ValidTo>**dd/MM/yyyy**</ValidTo>

<OrganizationCA><!\[CDATA\[\]\]></OrganizationCA>

</Certificate>

Trong đó: tag <OwnCA>: Tên tổ chức sở hữu

tag <SerialNumber>: Serial chứng thư

tag <ValidFrom>: Ngày hiệu lực của chứng thư

tag <ValidTo>: Ngày hết hạn của chứng thư

tag <OrganizationCA>: Nhà cung cấp chứng thư

### Cập nhật loại hình ký số và chứng thư số

URL

String **UpdateCertificate**(string Account, string ACpass,  string certinfo, string serialCert, int certType, int id = 0)

DESCRIPTION

Đây là web service đăng ký/cập nhật loại hình ký số và chứng thư số của đơn vị.

HTTP METHOD

POST

REQUEST BODY

*   **Account / ACpass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống). 
*   **Certinfo**: Chuỗi thông tin chứng thư số
*   **serialCert**: Serial chứng thư số
*   **certType**: loại hình ký số (4-token; 6-SmartCA)
*   **id**: giá trị id chứng thư số (=0 nếu là thêm mới)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:41 | Đã tồn tại chứng thư này trong hệ thống |  |
| ERR:42 | Chứng thư đã đăng ký với thuế, không thể thay đổi. Hãy đăng ký tờ khai thay đổi thông tin. |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| int | Giá trị id chứng thư số trả về sau khi thực hiện thành công |  |

### Xóa chứng thư số

URL

String **DeleteCertificate**(string Account, string ACpass, int id = 0)

DESCRIPTION

Đây là web service xóa thông tin chứng thư số của đơn vị.

HTTP METHOD

POST

REQUEST BODY

*   **Account / ACpass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).  
*   **id**: giá trị id chứng thư số cần xóa.

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:41 | Đã tồn tại chứng thư này trong hệ thống |  |
| ERR:42 | Chứng thư đã đăng ký với thuế, không thể thay đổi. Hãy đăng ký tờ khai thay đổi thông tin. |  |
| ERR:43 | Chứng thư không phải của công ty |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| OK | Thực hiện xóa thành công |  |

### Danh sách chứng thư số của đơn vị

URL

String **GetCertificates** (string userName, string password)

DESCRIPTION

Đây là web service lấy thông tin chứng thư số hiện tại của đơn vị.

HTTP METHOD

POST

REQUEST BODY

*   **userName/password**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống). 

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| Chuỗi base64 | Chuỗi base64 trả về của chuỗi XML thông tin danh sách chứng thư |  |

Cấu trúc chuỗi XML trả về: 

**<Certificates>**

**<Certificate>**

**<OwnCA>**

**<!\[CDATA\[\]\]>**

**</OwnCA>**

**<SerialNumber></SerialNumber>**

**<ValidFrom> dd/MM/yyyy </ValidFrom>**

**<ValidTo> dd/MM/yyyy </ValidTo>**

**<OrganizationCA>**

**<!\[CDATA\[\]\]>**

**</OrganizationCA>**

**<Status></Status>**

**<CertType></CertType>**

**</Certificate>**

**</Certificates>**

Trong đó:             tag <OwnCA>: Tên tổ chức sở hữu

tag <SerialNumber>: Serial chứng thư

tag <ValidFrom>: Ngày hiệu lực của chứng thư

tag <ValidTo>:  Ngày hết hạn của chứng thư

tag <OrganizationCA>: Nhà cung cấp chứng thư

tag <Status>: Trạng thái chứng thư (0-chưa sử dụng, 1-đang sử dụng)

tag <CertType>: Loại chứng thư (1-token; 6-SmartCA)

### Thay đổi mật khẩu

URL

String **resetPassword**(string Account, string oldPass, string newPass)

DESCRIPTION

Đây là web service thay đổi mật khẩu.

HTTP METHOD

POST

REQUEST BODY

*   **Account**: Tên tài khoản được cấp phát cho khách hàng để đăng nhập vào hệ thống.  
*   **oldPass**: mật khẩu cũ.
*   **newPass**: mật khẩu mới.

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| MSG_Update_006 | Mật khẩu không được để trống. |  |
| MSG_Update_001 | Không tìm thấy thông tin tài khoản. |  |
| MSG_Update_004 | Mật khẩu cũ không chính xác. |  |
| MSG_Update_003 | Mật khẩu mới không được trùng với mật khẩu cũ. |  |
| MSG_Update_005 | Có lỗi xảy ra | Lỗi không xác định |
| MSG_Update_002 | Thay đổi mật khẩu thành công. |  |

## Nhóm các hàm webservice liên quan đến tra cứu hóa đơn ( PortalService)

### Download hóa đơn

URL

String **downloadInv**(string invToken, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về chuỗi xml của hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken :** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy Pattern |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_Xml_trả_về | Trả về chuỗi Xml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng string Xml |

### Download hóa đơn với cả các hóa đơn chưa thanh toán

URL

String **downloadInvNoPay** (string invToken, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về chuỗi xml của hóa đơn, cho phép tải các hóa đơn chưa thanh toán.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken :** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy Pattern |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_Xml_trả_về | Trả về chuỗi Xml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng string Xml |

### Download hóa đơn theo Fkey

URL

String **downloadInvFkey** (string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về chuỗi xml của hóa đơn theo fkey truyền lên

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey :** Chuỗi fkey xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_Xml_trả_về | Trả về chuỗi Xml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng string Xml |

### Download hóa đơn theo fkey, không kiểm tra trạng thái thanh toán

URL

String **downloadInvFkeyNoPay** (string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về chuỗi xml của hóa đơn theo fkey truyền lên, cho phép tải cả hóa đơn chưa thanh toán.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey :** Chuỗi fkey xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_Xml_trả_về | Trả về chuỗi Xml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng string Xml |

### Download hóa đơn mới tạo theo Fkey định dạng Pdf

URL

String **downloadNewInvPDFFkey**(string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về dạng pdf của hóa đơn mới tạo theo Fkey truyền lên.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey:** Chuỗi fkey xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Fkey truyền lên rỗng |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| Chuỗi base64 | Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF |  |

### Download hóa đơn định dạng Pdf

URL

String **downloadInvPDF**(string invToken, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về dạng pdf của hóa đơn theo token truyền lên.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken:** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| Chuỗi base64 | Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF |  |

### Download hóa đơn định dạng Pdf, không kiểm tra trạng thái thanh toán

URL

String **downloadInvPDFFkeyNoPay** (string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về dạng pdf của hóa đơn theo fkey truyền lên, cho phép tải cả hóa đơn chưa thanh toán.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey:** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| Chuỗi base64 | Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF |  |

### Lấy danh sách hóa đơn từ số, đến số

URL

string **listInvFromNoToNo (**string invFromNo, string invToNo, string invPattern, string invSerial, string userName, string userPass**)**

DESCRIPTION

Đây là web service cho phép trả về thông tin cơ bản của hóa đơn dạng chuỗi xml từ số hóa đơn đến số hóa đơn truyền vào.

_Chú ý_: tối đa lấy ra 100 hóa đơn hoặc theo cấu hình trên từng app

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invFromNo:** Số bắt đầu
*   **invToNo:** Số kết thúc
*   **invPattern**: Mẫu số
*   **invSerial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:7 | Không tìm thấy thông tin công ty |  |
| ERR: | Có lỗi xảy ra |  |
| chuỗi_xml_trả_về | Trả về chuỗi xml theo cấu trúc |  |

**Cấu trúc của chuỗi xml trả về**

<Data>

<Item >**//tương ứng với 1 hóa đơn**

<index>**Tháng xuất hóa đơn** </index>

<invToken>**Chuỗi token để xác định hóa đơn(pattern;Serial;Số hóa đơn)** </invToken>

<fkey>**Fkey của hóa đơn**</fkey>

<name>**Tên hóa đơn**</name>

<publishDate>**Ngày phát hành hóa đơn**</publishDate>

<signStatus>**Trạng thái kí khách hàng**</signStatus>

<total>**Tổng tiền trước thuế**</total>

<amount>**Tổng tiền của hóa đơn** </amount>

<pattern>**Mẫu hóa đơn**<pattern>

<serial>**Serial hóa đơn**</serial>

<invNum>**Số hóa đơn**</invNum>

<status>**Trạng thái hóa đơn**</status>

<cusname>**Tên người mua hàng**</cusname>

<payment>**Trạng thái thanh toán**</payment >

</Item >

<Item >…</Item > **//Hóa đơn khác**

</Data>

### Tìm kiếm hóa đơn theo khách hàng

URL

string **listInvByCus**(string cusCode, string fromDate, string toDate, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép trả về thông tin cơ bản của hóa đơn dạng chuỗi xml theo fkey truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **cusCode**\*: Mã đơn vị cần lấy hóa đơn về
*   **fromDate:** ngày bắt đầu tìm kiếm. String theo định dạng dd/MM/yyyy (20/05/2013). Nếu truyền vào null tìm kiếm theo tất cả các ngày
*   **toDate:** ngày kết thúc tìm kiếm. String theo định dạng dd/MM/yyyy. Nếu truyền vào null tìm kiếm theo tất cả các ngày
*   **userName/userPass**\***:** account/password để gọi web services. Do Hệ thống HĐĐT cung cấp.

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:3 | Không tồn tài khách hàng tương ứng với cusCode |  |
| ERR:4 | Công ty chưa được đăng kí mẫu hóa đơn nào |  |
| ERR:7 | Không tìm thấy thông tin công ty |  |
| ERR: | Có lỗi xảy ra |  |
| OK: chuỗi_xml_trả_về | thông tin các hóa đơn đã phát hành, đã sửa đổi, đã thay thế, đã sử dụng của công ty, cấu trúc dưới dạng chuỗi xml. Mỗi thẻ <Inv> tương ứng với một hóa đơnThẻ <status> chứa trạng thái hóa đơn: 1- hóa đơn đã phát hành, 3- hóa đơn bị thay thế, 4- hóa đơn bị điều chỉnh |  |

**Cấu trúc của chuỗi xml trả về**

<Data>

<Item > **//tương ứng với 1 hóa đơn**

<index>**Tháng xuất hóa đơn** </index>

<invToken>**Pattern;Serial;So hoa don** </invToken >

<fkey>**Fkey để xác định hóa đơn** </fkey >

<name>**Tên hóa đơn**</name>

<publishDate>**Ngày phát hành hóa đơn**</publishDate>

<signStatus>**Trạng thái kí khách hàng**</signStatus>

<total>**Tổng tiền**</total>

<amount>**Tổng tiền sau thuế của hóa đơn**</amount>

<pattern>**Mẫu hóa đơn**<pattern>

<serial>**Serial hóa đơn**</serial>

<invNum>**Số hóa đơn**</invNum>

<status>**Trạng thái hóa đơn(1,3,4)**</status >

<payment>**Trạng thái thanh toán (0/1)**</payment>

</Item >

<Item ></Item >**….Hóa đơn khác**

</Data>

### Tìm kiếm hóa đơn theo fkey

URL

string **listInvByCusFkey**(string fkey, string fromDate, string toDate, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép trả về thông tin cơ bản của hóa đơn dạng chuỗi xml theo fkey truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fromDate:** ngày bắt đầu tìm kiếm. String theo định dạng dd/MM/yyyy (20/05/2020). Nếu truyền vào null tìm kiếm theo tất cả các ngày
*   **toDate:** ngày kết thúc tìm kiếm. String theo định dạng dd/MM/yyyy. Nếu truyền vào null tìm kiếm theo tất cả các ngày
*   **fkey**\*: Mã xác định hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:4 | Công ty chưa được đăng kí mẫu hóa đơn nào |  |
| ERR:7 | Không tìm thấy thông tin công ty |  |
| ERR: | Có lỗi xảy ra |  |
| OK: chuỗi_xml_trả_về | Thông tin các hóa đơn đã phát hành, đã sửa đổi, đã thay thế, đã sử dụng của công ty, cấu trúc dưới dạng chuỗi xml. Mỗi thẻ <Inv> tương ứng với một hóa đơnThẻ <status> chứa trạng thái hóa đơn: 1- hóa đơn đã phát hành, 3- hóa đơn bị thay thế, 4- hóa đơn bị điều chỉnh |  |

**Cấu trúc của chuỗi xml trả về**

<Data>

<Item > **//tương ứng với 1 hóa đơn**

<index>**Tháng xuất hóa đơn** </index>

<cusCode>**Mã khách hàng**</cusCode>

<month></month>

<name>**Tên hóa đơn**</name>

<publishDate>**Ngày phát hành hóa đơn**</publishDate>

<signStatus>**Trạng thái kí khách hàng**</signStatus>

<pattern>**Mẫu hóa đơn**<pattern>

<serial>**Serial hóa đơn**</serial>

<invNum>**Số hóa đơn**</invNum>

<amount>**Tổng tiền của hóa đơn** </amount>

<status>**Trạng thái hóa đơn**</status>

<cusname>**Tên người mua hàng**</cusname>

<payment>**Trạng thái thanh toán**</payment >

<converted>**1: đã chuyển đổi / 0: chưa chuyển đổi**</payment >

</Item >

<Item ></Item >**….Hóa đơn khác**

</Data>

### Lấy thông tin chi tiết hóa đơn

URL

string **getInvView**(string invToken, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép trả về định dạng html của hóa đơn theo chuỗi token truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken :** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Công ty chưa được đăng kí mẫu hóa đơn nào |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | Không tìm thấy thông tin công ty |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng html |

### Lấy thông tin chi tiết hóa đơn, không kiểm tra trạng thái thanh toán

URL

string **getInvViewNoPay** (string invToken, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép trả về định dạng html của hóa đơn theo chuỗi token truyền vào, không kiểm tra trạng thái thanh toán

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken :** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Công ty chưa được đăng kí mẫu hóa đơn nào |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | Không tìm thấy thông tin công ty |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng html |

### Lấy thông tin chi tiết hóa đơn theo fkey

URL

string **getInvViewFkey** (string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép trả về định dạng html của hóa đơn theo fkey truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey :** Chuỗi key xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:4 | Công ty chưa được đăng kí mẫu hóa đơn nào |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | Không tìm thấy thông tin công ty |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng html |

### Lấy thông tin chi tiết hóa đơn tạo mới theo fkey

URL

string **getNewInvViewFkey**(string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép trả về định dạng html của hóa đơn mới tạo theo fkey truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey :** Chuỗi key xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Fkey truyền vào rỗng |  |
| ERR:4 | Công ty chưa được đăng kí mẫu hóa đơn nào |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | Không tìm thấy thông tin công ty |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_html_trả_về | Trả về chuỗi html tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng html |

### Lấy thông tin chi tiết của hóa đơn theo fkey, không kiểm tra trạng thái thanh toán

URL

string **getInvViewFkeyNoPay** (string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép trả về định dạng html của hóa đơn theo fkey truyền vào, không kiểm tra trạng thái thanh toán.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey :** Chuỗi key xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:4 | Công ty chưa được đăng kí mẫu hóa đơn nào |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | Không tìm thấy thông tin công ty |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng html |

### Chuyển đổi hóa đơn chứng minh nguồn gốc, xuất xứ

URL

string **convertForVerify** (string invToken, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện chuyển đổi với mục đích chứng minh nguồn gốc xuất xứ cho hóa đơn. Mỗi hóa đơn sẽ chỉ được chuyển đổi 1 lần duy nhất.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken :** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn đã được chuyển đổi |  |
| ERR:5 | Có lỗi xảy ra |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn đã chuyển đổi | Trả về một hóa đơn dưới dạng html |

### Chuyển đổi hóa đơn chứng minh nguồn gốc, xuất xử theo fkey

URL

string **convertForVerifyFkey** (string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện chuyển đổi với mục đích chứng minh nguồn gốc xuất xứ cho hóa đơn. Mỗi hóa đơn sẽ chỉ được chuyển đổi 1 lần duy nhất.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống)
*   **fkey :** Chuỗi key xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn đã được chuyển đổi |  |
| ERR:5 | Có lỗi xảy ra |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn đã chuyển đổi | Trả về một hóa đơn dưới dạng html |

### Chuyển đổi lưu trữ hóa đơn

URL

string **convertForStore** (string invToken, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện chuyển đổi với mục đích lưu trữ, mỗi hóa đơn sẽ được chuyển đổi nhiều lần.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken :** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Chuỗi token không chính xác |  |
| ERR:7 | Không tìm thấy công ty |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:8 | Hóa đơn đã chuyển đổi |  |
| ERR:5 | Có lỗi xảy ra |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn đã chuyển đổi | Trả về một hóa đơn dưới dạng html |

### Lấy thông tin khách hàng

URL

string **getCus(**string cusCode, string userName, string userPass**)**

DESCRIPTION

Đây là web service thực hiện lấy thông tin khách hàng dựa vào mã khách hàng truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **cusCode:** Mã khách hàng

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:7 | Không tìm thấy khách hàng hoặc công ty tương ứng | Kiểu string |
| ERR:3 | Không tìm thấy thông tin khách hàng |  |
| ERR: | Lỗi không xác định |  |
| Chuỗi xml trả về | Chuỗi xml thông tin khách hàng | Kiểu string |

**Cấu trúc chuỗi XML trả về:**

<Data>

<code>**{0}**</code>

<name><!\[CDATA\[{0}\]\]></name>

<address><!\[CDATA\[{0}\]\]></address>

<phone>**{0}**</phone>

<taxcode>**{0}**</taxcode>

<email>**{0}**</email>

</Data>

### Chuyển đổi lưu trữ hóa đơn theo Fkey

URL

string **convertForStoreFkey** (string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện chuyển đổi với mục đích lưu trữ PDF, mỗi hóa đơn sẽ được chuyển đổi nhiều lần.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey:** Chuỗi fkey xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Chuỗi token không chính xác |  |
| ERR:7 | Không tìm thấy công ty |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:8 | Hóa đơn đã chuyển đổi |  |
| ERR:5 | Có lỗi xảy ra |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| chuỗi_base64_trả_về | Trả về chuỗi base64 tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng string base64 |

### Download hóa đơn lỗi gửi thuế theo Fkey

URL

String **downloadInvErrorFkey** (string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về chuỗi xml của hóa đơn lỗi gửi cơ quan thuế theo fkey truyền lên

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey :** Chuỗi fkey xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| chuỗi_Xml_trả_về | Trả về chuỗi Xml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng string Xml |

### Download hóa đơn lỗi gửi cơ quan thuế định dạng Pdf theo token

URL

String **downloadInvErrorPDF**(string token, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về dạng pdf của hóa đơn lỗi gửi cơ quan thuế theo token truyền lên.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   token**:** Chuỗi fkey xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| Chuỗi base64 | Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF |  |

### Download hóa đơn lỗi gửi cơ quan thuế định dạng HTML

URL

String **GetInvErrorViewFkey** (string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về dạng HTML của hóa đơn lỗi gửi cơ quan thuế theo token truyền lên.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   fkey**:** Chuỗi fkey xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Công ty chưa có mẫu hóa đơn nào |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| Chuỗi base64 | Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .html để được file HTML |  |

### Download hóa đơn lỗi gửi thuế định dạng Pdf theo Fkey

URL

String **downloadInvPDFFkeyError** (string invToken, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về dạng pdf của hóa đơn theo token truyền lên.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken:** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| Chuỗi base64 | Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF |  |

### Download hóa đơn lỗi gửi cơ quan thuế theo invtoken

URL

String **downloadInvError**(string invToken, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về chuỗi xml của hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken :** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy Pattern |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| chuỗi_Xml_trả_về | Trả về chuỗi Xml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng string Xml |

### Download hóa đơn lỗi gửi cơ quan thuế với cả các hóa đơn chưa thanh toán theo invtoken

URL

String **downloadInvNoPayError** (string invToken, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về chuỗi xml của hóa đơn, cho phép tải các hóa đơn chưa thanh toán.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken :** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy Pattern |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| chuỗi_Xml_trả_về | Trả về chuỗi Xml tương ứng với hóa đơn | Trả về một hóa đơn dưới dạng string Xml |

### Download hóa đơn lỗi gửi thuế định dạng Pdf, không kiểm tra trạng thái thanh toán theo fkey

URL

String **downloadInvPDFFkeyNoPayError** (string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về dạng pdf của hóa đơn theo fkey truyền lên, cho phép tải cả hóa đơn chưa thanh toán.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey:** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| Chuỗi base64 | Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF |  |

### Download hóa đơn lỗi gửi thuế định dạng Pdf, không kiểm tra trạng thái thanh toán theo Token

URL

String **downloadInvPDFNoPayError** (string token, string userName, string userPass)

DESCRIPTION

Đây là web service cho phép tải về dạng pdf của hóa đơn theo token truyền lên.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **token:** Chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| Chuỗi base64 | Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF |  |

### Lấy danh sách hóa đơn từ ngày đến ngày theo mẫu số, ký hiệu

URL

String **GetInvViewByDate**(string userName, string userPass, string pattern, string serial, string fromDate, string toDate)

DESCRIPTION

Đây là web service cho phép lấy danh sách hóa đơn từ ngày đến ngày theo mẫu số, ký hiệu.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **pattern:** mẫu số
*   **serial**: ký hiệu
*   **fromDate**: từ ngày
*   **toDate**: đến ngày

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Không tìm thấy hóa đơn |  |
| ERR:3 | Sai định dạng ngày tháng |  |
| ERR:4 | Không lấy được bảng hóa đơn (sai mẫu số) |  |
| ERR:6 | Vượt quá giới hạn số lượng hóa đơn được phép lấy (500 hóa đơn) |  |
| ERR:5 | Có lỗi xảy ra |  |
| ERR:7 | Vượt quá giới hạn 7 ngày |  |
| Chuỗi base64 | Trả về chuỗi base64 của xml danh sách hóa đơn |  |

Cấu trúc xml trả về (được base64):

<DSHDon>

<HDon>

<DLieu>XML hóa đơn đã base64</DLieu>

<Loai>Loại hóa đơn(0: hóa đơn gốc; 1: hóa đơn thay thế; 2,3,4,5: hóa đơn điều chỉnh)</Loai>

<TThai>Trạng thái hóa đơn(0: hóa đơn mới; 1: hóa đơn phát hành; 3: hóa đơn thay thế; 4: hóa đơn điều chỉnh; 5: hóa đơn hủy)</TThai>

</HDon>

</DSHDon>

### Download file .zip hóa đơn theo Fkey

URL

String **downloadInvZipFkey**(string fkey, string userName, string userPass, bool checkPayment)

DESCRIPTION

Đây là web service cho phép tải về file .zip chứa 2 file .xml và .html của hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey :** Chuỗi fkey xác định hóa đơn
*   **checkPayment**: “true”: Chỉ cho tải hóa đơn có trạng thái là đã thanh toán; “false”: Tải hóa đơn không cần kiểm tra hóa đơn đã thanh toán hay chưa

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:4 | Không tìm thấy dải thông báo phát hành |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| Chuỗi Base64 | Trả về chuỗi Base64. Lưu chuỗi Base64 này thành file .zip chứa 2 file .xml và .html của hóa đơn |  |

### Download file .zip hóa đơn theo Token

URL

String **downloadInvZipToken**(string invToken, string userName, string userPass, bool checkPayment)

DESCRIPTION

Đây là web service cho phép tải về file .zip chứa 2 file .xml và .html của hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invToken :** Chuỗi token xác định hóa đơn cần lấy (theo cấu trúc pattern;serial;số hóa đơn. VD: 1/001;K22TAA;1)
*   **checkPayment**: “true”: Chỉ cho tải hóa đơn có trạng thái là đã thanh toán; “false”: Tải hóa đơn không cần kiểm tra hóa đơn đã thanh toán hay chưa

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền ServiceRole |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:4 | Không tìm thấy Pattern |  |
| ERR:6 | Không tìm thấy hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user. |  |
| ERR:11 | Hóa đơn chưa thanh toán nên không xem được |  |
| ERR:12 | Biên lai điện tử có mã chưa được thuế chấp nhận |  |
| ERR:13 | Biên lai điện tử không mã chưa được thuế chấp nhận |  |
| Chuỗi Base64 | Trả về chuỗi Base64. Lưu chuỗi Base64 này thành file .zip chứa 2 file .xml và .html của hóa đơn |  |

## Nhóm các hàm webservice xử lý hóa đơn ( BussinessService)

### Gạch nợ hóa đơn theo fkey

URL

String **confirmPaymentFkey**(string lstFkey, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện gạch nợ hóa đơn theo danh sách fkey truyền vào.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **lstFkey:** Chuỗi Fkey xác định hóa đơn cần lấy(các Fkey phân biệt nhau bằng “\_”)

**VD:** 012013\_022013\_032013

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:6 | Không tìm thấy hóa đơn tương ứng chuỗi đưa vào |  |
| ERR:7 | Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định |  |
| ERR:13 | Hóa đơn đã được gạch nợ trước đó |  |
| OK | Đánh dấu hóa đơn trong list đã được gạch nợ |  |

### Gạch nợ hóa đơn

URL

String **confirmPayment** (string lstInvToken, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện gạch nợ hóa đơn theo danh sách chuỗi invtoken truyền vào.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **lstInvToken:** Chuỗi token xác định hóa đơn (theo cấu trúc patternt;serial;sốhóađơn)

**VD:** 01GTKT2/001;AA/13E;10\_01GTKT2/001;AA/13E;11

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:6 | Không tìm thấy hóa đơn tương ứng chuỗi đưa vào |  |
| ERR:7 | Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định |  |
| ERR:13 | Hóa đơn đã được gạch nợ trước đó |  |
| OK | Đánh dấu hóa đơn trong list đã được gạch nợ |  |

### Bỏ gạch nợ hóa đơn theo fkey

URL

string **UnconfirmPaymentFkey**(string lstFkey, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện bỏ gạch nợ hóa đơn theo danh sách chuỗi fkey truyền vào.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **lstFkey:** Chuỗi Fkey xác định hóa đơn cần lấy(các Fkey phân biệt nhau bằng “\_”)

**VD:** 012013\_022013\_032013

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:6 | Không tìm thấy hóa đơn tương ứng chuỗi đưa vào |  |
| ERR:7 | Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định |  |
| ERR:13 | Hóa đơn đã được bỏ gạch nợ trước đó |  |
| OK | Đánh dấu hóa đơn trong list đã được bỏ gạch nợ |  |

### Bỏ gạch nợ hóa đơn

URL

string **unConfirmPayment** (string lstInvToken, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện bỏ gạch nợ hóa đơn theo danh sách chuỗi invtoken truyền vào.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **lstInvToken:** Chuỗi token xác định hóa đơn (theo cấu trúc patternt;serial;sốhóađơn)

**VD:** 01GTKT2/001;AA/13E;10\_01GTKT2/001;AA/13E;11

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Chuỗi token không đúng định dạng |  |
| ERR:6 | Không tìm thấy hóa đơn tương ứng chuỗi đưa vào |  |
| ERR:7 | Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định |  |
| ERR:13 | Hóa đơn đã được bỏ gạch nợ trước đó |  |
| OK | Đánh dấu hóa đơn trong list đã được bỏ gạch nợ |  |

### Điều chỉnh hóa đơn

URL

string **AdjustInvoiceAction**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, string AttachFile, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện điều chỉnh hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn điều chỉnh
*   **fkey:** Chuỗi xác định hóa đơn cần điều chỉnh
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu
*   **AttachFile:** Đường dẫn file biên bản hoặc key để sinh biên bản tự động (=10: sinh biên bản tự động, =11: sinh và ký biên bản tự động, != 10 và !=11: Đường dẫn file biên bản)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Hóa đơn cần điều chỉnh không tồn tại |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Không phát hành được hóa đơn |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được điều chỉnh |  |
| ERR:13 | Lỗi trùng fkey | Fkey của hóa đơn mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:21 | Trùng Fkey truyền vào |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnhSerial 🡪 serial của hóa đơn điều chỉnhinvNumber: số hóa đơn điều chỉnh |  |

**Cấu trúc của xmlInvData trường hợp không có trường mở rộng (các trường \* là bắt buộc):**

<AdjustInv>

<key> **Giá trị khóa để phân biệt hóa đơn xuất cho khách hàng nào** </key>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod> **Phương thức thanh toán** </PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue> **GrossValue** </GrossValue>

<GrossValue0> **GrossValue0**</GrossValue0>

<VatAmount0> **VatAmount0**</VatAmount0>

<GrossValue5> **GrossValue5**</GrossValue5>

<VatAmount5> **VatAmount5**</VatAmount5>

<GrossValue10> **GrossValue10**</GrossValue10>

<VatAmount10> **VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<Type>**Loại hóa đơn chỉnh sửa(int-mặc định lấy là 2) 2-Điều chỉnh tăng, 3-Điều chỉnh giảm, 4- Hóa đơn điều chỉnh thông tin**</Type>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</AdjustInv>

**Cấu trúc của xmlInvData trường hợp Có trường mở rộng (các trường \* là bắt buộc):**

<AdjustInv>

<key> **Giá trị khóa để phân biệt hóa đơn xuất cho khách hàng nào** </key>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod> **Phương thức thanh toán** </PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Extras>

<Extra\_item>

<Extra\_Name>**Extra\_Name**</Extra\_Name>

<Extra\_Value>**Extra\_Value**</Extra\_Value>

</Extra\_item>

</Extras>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue> **GrossValue** </GrossValue>

<GrossValue0> **GrossValue0**</GrossValue0>

<VatAmount0> **VatAmount0**</VatAmount0>

<GrossValue5> **GrossValue5**</GrossValue5>

<VatAmount5> **VatAmount5**</VatAmount5>

<GrossValue10> **GrossValue10**</GrossValue10>

<VatAmount10> **VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<Type>**Loại hóa đơn chỉnh sửa(int-mặc định lấy là 2) 2-Điều chỉnh tăng, 3-Điều chỉnh giảm, 4- Hóa đơn điều chỉnh thông tin**</Type>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</AdjustInv>

### Điều chỉnh hóa đơn theo số hóa đơn truyền vào

URL

string **AdjustActionAssignedNo**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, string AttachFile, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện điều chỉnh hóa đơn cho phép truyền số hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn điều chỉnh
*   **fkey:**Chuỗi xác định hóa đơn cần điều chỉnh
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Hóa đơn cần điều chỉnh không tồn tại |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Không phát hành được hóa đơn |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được điều chỉnh |  |
| ERR:13 | Lỗi trùng fkey | Fkey của hóa đơn mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:31 | Số hóa đơn truyền vào không hợp lệ |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnhSerial 🡪 serial của hóa đơn điều chỉnhinvNumber: số hóa đơn điều chỉnh |  |

**Cấu trúc của xmlInvData trường hợp không có trường mở rộng (các trường \* là bắt buộc):**

<AdjustInv>

<key> **Giá trị khóa để phân biệt hóa đơn xuất cho khách hàng nào** </key>

**<**InvoiceNo**\>Số hóa đơn</**InvoiceNo**\>**

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod> **Phương thức thanh toán** </PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue> **GrossValue** </GrossValue>

<GrossValue0> **GrossValue0**</GrossValue0>

<VatAmount0> **VatAmount0**</VatAmount0>

<GrossValue5> **GrossValue5**</GrossValue5>

<VatAmount5> **VatAmount5**</VatAmount5>

<GrossValue10> **GrossValue10**</GrossValue10>

<VatAmount10> **VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<Type>**Loại hóa đơn chỉnh sửa(int-mặc định lấy là 2) 2-Điều chỉnh tăng, 3-Điều chỉnh giảm, 4- Hóa đơn điều chỉnh thông tin**</Type>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</AdjustInv>

**Cấu trúc của xmlInvData trường hợp Có trường mở rộng (các trường \* là bắt buộc):**

<AdjustInv>

<key> **Giá trị khóa để phân biệt hóa đơn xuất cho khách hàng nào** </key>

**<**InvoiceNo**\>Số hóa đơn</**InvoiceNo**\>**

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod> **Phương thức thanh toán** </PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Extras>

<Extra\_item>

<Extra\_Name>**Extra\_Name**</Extra\_Name>

<Extra\_Value>**Extra\_Value**</Extra\_Value>

</Extra\_item>

</Extras>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</ DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue> **GrossValue** </GrossValue>

<GrossValue0> **GrossValue0**</GrossValue0>

<VatAmount0> **VatAmount0**</VatAmount0>

<GrossValue5> **GrossValue5**</GrossValue5>

<VatAmount5> **VatAmount5**</VatAmount5>

<GrossValue10> **GrossValue10**</GrossValue10>

<VatAmount10> **VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<Type>**Loại hóa đơn chỉnh sửa(int-mặc định lấy là 2) 2-Điều chỉnh tăng, 3-Điều chỉnh giảm, 4- Hóa đơn điều chỉnh thông tin**</Type>

</AdjustInv>

### Html xem trước khi điều chỉnh hóa đơn

URL

string **AdjustInvoiceNoPublish**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện lấy dữ liệu html hóa đơn mới của điều chỉnh hóa đơn trước khi ký số phát hành

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn điều chỉnh
*   **fkey:** Chuỗi xác định hóa đơn cần điều chỉnh
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Hóa đơn cần điều chỉnh không tồn tại |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình tạo mới hóa đơn điều chỉnh |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được điều chỉnh |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn điều chỉnh nhưng chưa phát hành, ký số | Trả về một hóa đơn dưới dạng html |

**Cấu trúc của xmlInvData trường hợp không có trường mở rộng (các trường \* là bắt buộc):**

<AdjustInv>

<key> **Giá trị khóa để phân biệt hóa đơn xuất cho khách hàng nào** </key>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod> **Phương thức thanh toán** </PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue> **GrossValue** </GrossValue>

<GrossValue0> **GrossValue0**</GrossValue0>

<VatAmount0> **VatAmount0**</VatAmount0>

<GrossValue5> **GrossValue5**</GrossValue5>

<VatAmount5> **VatAmount5**</VatAmount5>

<GrossValue10> **GrossValue10**</GrossValue10>

<VatAmount10> **VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<Type>**Loại hóa đơn chỉnh sửa(int-mặc định lấy là 2) 2-Điều chỉnh tăng, 3-Điều chỉnh giảm, 4- Hóa đơn điều chỉnh thông tin**</Type>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</AdjustInv>

**Cấu trúc của xmlInvData trường hợp Có trường mở rộng (các trường \* là bắt buộc):**

<AdjustInv>

<key> **Giá trị khóa để phân biệt hóa đơn xuất cho khách hàng nào** </key>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod> **Phương thức thanh toán** </PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Extras>

<Extra\_item>

<Extra\_Name>**Extra\_Name**</Extra\_Name>

<Extra\_Value>**Extra\_Value**</Extra\_Value>

</Extra\_item>

</Extras>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue> **GrossValue** </GrossValue>

<GrossValue0> **GrossValue0**</GrossValue0>

<VatAmount0> **VatAmount0**</VatAmount0>

<GrossValue5> **GrossValue5**</GrossValue5>

<VatAmount5> **VatAmount5**</VatAmount5>

<GrossValue10> **GrossValue10**</GrossValue10>

<VatAmount10> **VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus>**1.1**</CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<Type>**Loại hóa đơn chỉnh sửa(int-mặc định lấy là 2) 2-Điều chỉnh tăng, 3-Điều chỉnh giảm, 4- Hóa đơn điều chỉnh thông tin**</Type>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</AdjustInv>

### Hủy hóa đơn theo fkey

URL

string **cancelInv**(string Account, string ACpass, string Fkey, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện hủy hóa đơn theo giá trị fkey truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **fkey:**Chuỗi xác định hóa đơn cần hủy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy hóa đơn |  |
| ERR:6 | Lỗi không xác định |  |
| ERR:7 | Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định |  |
| ERR:8 | Hóa đơn đã bị điều chỉnh / hủy / hóa đơn mới tạo không thể hủy được |  |
| ERR:9 | Hóa đơn đã thanh toán, không cho phép hủy |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| OK: | Hủy hóa đơn thành công |  |

### Thay thế hóa đơn

URL

string **ReplaceInvoiceAction**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, string Attachfile, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện thay thế hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn thay thế
*   **fkey:** Chuỗi xác định hóa đơn cần thay thế
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu
*   **AttachFile:** Đường dẫn file biên bản hoặc key để sinh biên bản tự động (=10: sinh biên bản tự động, =11: sinh và ký biên bản tự động, != 10 và !=11: Đường dẫn file biên bản)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình thay thế hóa đơn |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn đã được thay thế rồi. Không thể thay thế nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được thay thế |  |
| ERR:13 | Lỗi trùng fkey | Fkey của hóa đơn mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:21 | Trùng Fkey truyền vào |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thay thếPatter🡪 Mẫu số của hóa đơn thay thếSerial 🡪 serial của hóa đơn thay thếinvNumber: số hóa đơn thay thế |  |

**Cấu trúc của xmlInvData trường hợp không có trường mở rộng (các trường \* là bắt buộc):**

<ReplaceInv>

<key>**fkey hóa đơn\***</key>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod>**Phương thức thanh toán**</PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản ngân hàng**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue>**GrossValue**</GrossValue>

<GrossValue0>**GrossValue0**</GrossValue0>

<VatAmount0>**VatAmount0**</VatAmount0>

<GrossValue5>**GrossValue5**</GrossValue5>

<VatAmount5>**VatAmount5**</VatAmount5>

<GrossValue10>**GrossValue10**</GrossValue10>

<VatAmount10>**VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus></CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</ReplaceInv>

**Cấu trúc của xmlInvData trường hợp Có trường mở rộng (các trường \* là bắt buộc):**

<ReplaceInv>

<key>**fkey hóa đơn\***</key>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod>**Phương thức thanh toán**</PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản ngân hàng**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Extras>

<Extra\_item>

<Extra\_Name>**Extra\_Name**</Extra\_Name>

<Extra\_Value>**Extra\_Value**</Extra\_Value>

</Extra\_item>

</Extras>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue>**GrossValue**</GrossValue>

<GrossValue0>**GrossValue0**</GrossValue0>

<VatAmount0>**VatAmount0**</VatAmount0>

<GrossValue5>**GrossValue5**</GrossValue5>

<VatAmount5>**VatAmount5**</VatAmount5>

<GrossValue10>**GrossValue10**</GrossValue10>

<VatAmount10>**VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus></CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</ReplaceInv>

### Thay thế hóa đơn theo số hóa đơn truyền vào

URL

string **ReplaceActionAssignedNo**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, string Attachfile, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện thay thế hóa đơn cho phép truyền số hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn thay thế
*   **fkey:** Chuỗi xác định hóa đơn cần thay thế
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình thay thế hóa đơn |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn đã được thay thế rồi. Không thể thay thế nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được thay thế |  |
| ERR:13 | Lỗi trùng fkey | Fkey của hóa đơn mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:31 | Số hóa đơn truyền vào không hợp lệ |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thay thếPatter🡪 Mẫu số của hóa đơn thay thếSerial 🡪 serial của hóa đơn thay thếinvNumber: số hóa đơn thay thế |  |

**Cấu trúc của xmlInvData trường hợp không có trường mở rộng (các trường \* là bắt buộc):**

<ReplaceInv>

<key>**fkey hóa đơn\***</key>

**<**InvoiceNo**\>Số hóa đơn</**InvoiceNo**\>**

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod>**Phương thức thanh toán**</PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản ngân hàng**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue>**GrossValue**</GrossValue>

<GrossValue0>**GrossValue0**</GrossValue0>

<VatAmount0>**VatAmount0**</VatAmount0>

<GrossValue5>**GrossValue5**</GrossValue5>

<VatAmount5>**VatAmount5**</VatAmount5>

<GrossValue10>**GrossValue10**</GrossValue10>

<VatAmount10>**VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus></CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</ReplaceInv>

**Cấu trúc của xmlInvData trường hợp Có trường mở rộng (các trường \* là bắt buộc):**

<ReplaceInv>

<key>**fkey hóa đơn\***</key>

**<**InvoiceNo**\>Số hóa đơn</**InvoiceNo**\>**

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod>**Phương thức thanh toán**</PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản ngân hàng**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Extras>

<Extra\_item>

<Extra\_Name>**Extra\_Name**</Extra\_Name>

<Extra\_Value>**Extra\_Value**</Extra\_Value>

</Extra\_item>

</Extras>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue>**GrossValue**</GrossValue>

<GrossValue0>**GrossValue0**</GrossValue0>

<VatAmount0>**VatAmount0**</VatAmount0>

<GrossValue5>**GrossValue5**</GrossValue5>

<VatAmount5>**VatAmount5**</VatAmount5>

<GrossValue10>**GrossValue10**</GrossValue10>

<VatAmount10>**VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus></CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</ReplaceInv>

### Html xem trước khi thay thế hóa đơn

URL

string **ReplaceInvoiceNoPublish**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện lấy dữ liệu html hóa đơn mới của thay thế hóa đơn trước khi ký số phát hành

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn thay thế
*   **fkey:** Chuỗi xác định hóa đơn cần thay thế
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình tạo mới hóa đơn thay thế |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn đã được thay thế rồi. Không thể thay thế nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được thay thế |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn thay thế nhưng chưa phát hành, ký số | Trả về một hóa đơn dưới dạng html |

**Cấu trúc của xmlInvData trường hợp không có trường mở rộng (các trường \* là bắt buộc):**

<ReplaceInv>

<key>**fkey hóa đơn\***</key>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod>**Phương thức thanh toán**</PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản ngân hàng**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue>**GrossValue**</GrossValue>

<GrossValue0>**GrossValue0**</GrossValue0>

<VatAmount0>**VatAmount0**</VatAmount0>

<GrossValue5>**GrossValue5**</GrossValue5>

<VatAmount5>**VatAmount5**</VatAmount5>

<GrossValue10>**GrossValue10**</GrossValue10>

<VatAmount10>**VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus></CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>**SMSDeliver**</SMSDeliver>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</ReplaceInv>

**Cấu trúc của xmlInvData trường hợp Có trường mở rộng (các trường \* là bắt buộc):**

<ReplaceInv>

<key>**fkey hóa đơn\***</key>

<CusCode>**Mã khách hàng\***</CusCode>

<CusName>**Tên khách hàng\***</CusName>

<CusAddress>**Địa chỉ khách hàng\***</CusAddress>

<CusPhone>**Điện thoại khách hàng**</CusPhone>

<CusTaxCode>**Mã số thuế KH (Bắt buộc với KH là Doanh nghiệp)**</CusTaxCode>

<PaymentMethod>**Phương thức thanh toán**</PaymentMethod>

<CusBankName>**Tên ngân hàng**</CusBankName>

<KindOfService>**Tháng hóa đơn**</KindOfService>

<CusBankNo>**Số tài khoản ngân hàng**</CusBankNo>

<Products>

<Product>

<Code>**Mã sản phẩm\***</Code>

<ProdName>**Tên sản phẩm\***</ProdName>

<ProdUnit>**Đơn vị tính**</ProdUnit>

<ProdQuantity>**Số lượng**</ProdQuantity>

<ProdPrice>**Đơn giá**</ProdPrice>

<Amount>**Tổng tiền\***</Amount>

<Remark>**Remark**</Remark>

<Total>**Tổng tiền trước thuế\***</Total>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tổng tiền thuế\***</VATAmount>

<Extra1>**Mở rộng 1**</Extra1>

<Extra2>**Mở rộng 2**</Extra2>

<Discount>**Chiết khấu**</Discount>

<DiscountAmount>**Tổng tiền chiết khấu**</DiscountAmount>

<IsSum> **Tính chất \* (0-Hàng hóa, dịch vụ; 1-Khuyến mại; 2-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)**</IsSum>

</Product>

</Products>

<Extras>

<Extra\_item>

<Extra\_Name>**Extra\_Name**</Extra\_Name>

<Extra\_Value>**Extra\_Value**</Extra\_Value>

</Extra\_item>

</Extras>

<Total>**Tổng tiền trước thuế\***</Total>

<DiscountAmount>**Tiền giảm trừ**</DiscountAmount>

<VATRate>**Thuế GTGT\***</VATRate>

<VATAmount>**Tiền thuế GTGT\***</VATAmount>

<Amount>**Tổng tiền\***</Amount>

<AmountInWords>**Số tiền viết bằng chữ\***</AmountInWords>

<Extra>**Trường mở rộng**</Extra>

<ArisingDate>**Ngày dịch vụ**</ArisingDate>

<PaymentStatus>**Trạng thái thanh toán**</PaymentStatus>

<EmailDeliver>**EmailDeliver**</EmailDeliver>

<ComName>**Tên công ty**</ComName>

<ComAddress>**Địa chỉ công ty**</ComAddress>

<ComTaxCode>**Mã số thuế**</ComTaxCode>

<ComFax>**Company Fax**</ComFax>

<ResourceCode>**ResourceCode**</ResourceCode>

<GrossValue>**GrossValue**</GrossValue>

<GrossValue0>**GrossValue0**</GrossValue0>

<VatAmount0>**VatAmount0**</VatAmount0>

<GrossValue5>**GrossValue5**</GrossValue5>

<VatAmount5>**VatAmount5**</VatAmount5>

<GrossValue10>**GrossValue10**</GrossValue10>

<VatAmount10>**VatAmount10**</VatAmount10>

<Buyer>**Tên đơn vị mua hàng**</Buyer>

<Name>**Tên hóa đơn**</Name>

<ComPhone>**Điện thoại công ty**</ComPhone>

<ComBankName>**Tên ngân hàng**</ComBankName>

<ComBankNo>**Số tài khoản ngân hàng**</ComBankNo>

<CreateDate>**CreateDate**</CreateDate>

<DiscountRate>**Chiết khấu**</DiscountRate>

<CusSignStatus></CusSignStatus>

<CreateBy>**CreateBy**</CreateBy>

<PublishBy>**PublishBy**</PublishBy>

<Note>**Note**</Note>

<ProcessInvNote>**ProcessInvNote**</ProcessInvNote>

<Fkey>**Fkey**</Fkey>

<GrossValue\_NonTax></GrossValue\_NonTax>

<CurrencyUnit>**Đơn vị tiền tệ**</CurrencyUnit>

<ExchangeRate>**Tỷ giá**</ExchangeRate>

<ConvertedAmount>**Tổng tiền quy đổi**</ConvertedAmount>

<Extra1>**Extra1**</Extra1>

<Extra2>**Extra2**</Extra2>

<SMSDeliver>SMSDeliver</SMSDeliver>

<LDDNBo>**LDDNBO**</LDDNBo>

<HDSo>**HDSO**</HDSo>

<HVTNXHang>**HVTNXHANG**</HVTNXHang>

<TNVChuyen>**TNVCHUYEN**</TNVChuyen>

<PTVChuyen>**PTVCHUYEN**</PTVChuyen>

<HDKTSo>**HDKTSO**</HDKTSo>

<HDKTNgay>**HDKTNgay**</HDKTNgay>

</ReplaceInv>

### Hủy hóa đơn theo fkey

URL

string **cancelInv**(string Account, string ACpass, string Fkey, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện hủy hóa đơn theo giá trị fkey truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **fkey:**Chuỗi xác định hóa đơn cần hủy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy hóa đơn |  |
| ERR:6 | Lỗi không xác định |  |
| ERR:7 | Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định |  |
| ERR:8 | Hóa đơn đã bị điều chỉnh / hủy / hóa đơn mới tạo không thể hủy được |  |
| ERR:9 | Hóa đơn đã thanh toán, không cho phép hủy |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| OK: | Hủy hóa đơn thành công |  |

### Hủy hóa đơn không check trạng thái thanh toán

URL

string **cancelInvNoPay**(string Account, string ACpass, string Fkey, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện hủy hóa đơn theo giá trị fkey truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **fkey:**Chuỗi xác định hóa đơn cần hủy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy hóa đơn |  |
| ERR:6 | Lỗi không xác định |  |
| ERR:7 | Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định |  |
| ERR:8 | Hóa đơn đã bị điều chỉnh / hủy / hóa đơn mới tạo không thể hủy được |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| OK: | Hủy hóa đơn thành công |  |

### Gạch nợ hóa đơn theo fkey

URL

string **confirmPaymentFkey**(string lstFkey, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện gạch nợ hóa đơn theo fkey truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **lstFkey:** Chuỗi Fkey xác định hóa đơn cần lấy(các Fkey phân biệt nhau bằng “\_”)

**VD:**012013\_022013\_032013

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:6 | Không tìm thấy hóa đơn tương ứng chuỗi đưa vào |  |
| ERR:7 | Không thực hiện gạch nợ được hóa đơn | Khôn tìm thấy thông tin công tyKhông thực hiện được các nghiệp vụ deliverLỗi không xác định |
| ERR:13 | Hóa đơn đã thanh toán trước đó |  |
| OK | Hóa đơn gạch nợ thành công |  |

### Phân phối hóa đơn

URL

string **deliverInv**(string lstInvToken, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện tạo bản ghi deliver cho việc phân phối hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **lstInvToken:** Chuỗi token xác định hóa đơn cần lấy(theo cấu trúc patternt;serial;sốhóađơn)

**VD:** 01GTKT2/001;AA/13E;10\_01GTKT2/001;AA/13E;11

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Chuỗi token không hợp lệ |  |
| ERR:6 | Không tìm thấy hóa đơn tương ứng chuỗi đưa vào |  |
| ERR:11 | Chuỗi token đúng định dạng nhưng không tồn tại, hoặc là của hóa đơn đã bị hủy, bị thay thế |  |
| ERR: | Có lỗi không xác định |  |
| OK | Hóa đơn gạch nợ thành công |  |

### Đính kèm file bảng kê cho hóa đơn theo số hóa đơn

URL

string **ImportAttachmentByNo** (string Account, string ACpass, string username, string pass, byte\[\] bytes, string pattern, string serial, int no)

DESCRIPTION

Đây là web service thực hiện đính kèm file bảng kê cho hóa đơn theo số hóa đơn.

HTTP METHOD

POST

REQUEST BODY

*   **username /** **pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu
*   **no:** Số hóa đơn
*   **bytes:** file dạng byte

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Sai định dạng file |  |
| ERR:7 | Không tìm thấy công ty |  |
| ERR:4 | Không tìm thấy hóa đơn |  |
| ERR:3 | File vượt quá 10MB |  |
| ERR:6 | Lỗi tạo folder |  |
| ERR:5 | Có lỗi xảy ra |  |
| OK:MD5_file | Trả về OK: Chỗi MD5 của file |  |

### Dowload file bảng kê của hóa đơn theo Fkey

URL

string GetFile(string userName, string userPass, string fkey, string pattern)

DESCRIPTION

Đây là web service thực hiện tải file bảng kê của hóa đơn theo fkey.

HTTP METHOD

POST

REQUEST BODY

*   **userName/userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey:** Fkey của hóa đơn
*   **pattern**: Mẫu số

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:6 | Không tìm thấy hóa đơn với Fkey truyền vào |  |
| ERR:7 | Không tìm thấy công ty |  |
| ERR:8 | Hóa đơn không có file đính kèm |  |
| ERR:5 | Có lỗi xảy ra khi thực hiện tải file |  |
| Chuỗi base64 | Trả về chuỗi base64 tương ứng với file. |  |

### Điều chỉnh nhiều hóa đơn

URL

string **AdjustInvoiceMulti** (string Account, string ACpass, string xmlInvData, string username, string pass, string fkeys, string AttachFile, int? convert, string pattern = null, string serial = null)

DESCRIPTION

Đây là web service thực hiện điều chỉnh nhiều hóa đơn cùng lúc.

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn điều chỉnh
*   **fkeys:** Danh sách chuỗi fkey xác định các hóa đơn cần điều chỉnh
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Hóa đơn cần điều chỉnh không tồn tại |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Không phát hành được hóa đơn |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được điều chỉnh |  |
| ERR:13 | Lỗi trùng fkey | Fkey của hóa đơn mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnhSerial 🡪 serial của hóa đơn điều chỉnhinvNumber: số hóa đơn điều chỉnh |  |

### Khôi phục hóa đơn đã hủy Fkey

URL

string **restoreCancelInvFkey** (string Account, string ACpass, string fkey, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện khôi phục hóa đơn đã hủy về trạng thái đang sử dụng bằng Fkey

HTTP METHOD

POST

REQUEST BODY

*   **Account/** **ACpass**: Tài khoản truy cập CAdmin.
*   **fkey:** Fkey của hóa đơn cần khôi phục.
*   **userName/userPass:** Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy hóa đơn hoặc có nhiều hơn 1 hóa đơn với tham số đã truyền |  |
| ERR:8 | Hóa đơn đang không ở trạng thái đã hủy |  |
| ERR:7 | Tài khoản không phù hợp hoặc không tìm thấy company ứng với tài khoản đã khai báo |  |
| ERR:20 | Không tìm thấy thông tin PublishInvoice |  |
| ERR:6 | Lỗi Exception |  |
| OK | Khôi phục hóa đơn thành công |  |

### Khôi phục hóa đơn đã hủy Token

URL

string **restoreCancelInvFkey** (string Account, string ACpass, string token, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện khôi phục hóa đơn đã hủy về trạng thái đang sử dụng bằng Token

HTTP METHOD

POST

REQUEST BODY

*   **Account/** **ACpass**: Tài khoản truy cập CAdmin.
*   **token:** Chuỗi token xác định hóa đơn cần lấy(theo cấu trúc patternt;serial;sốhóađơn).
*   **userName/userPass:** Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy hóa đơn hoặc có nhiều hơn 1 hóa đơn với tham số đã truyền |  |
| ERR:8 | Hóa đơn đang không ở trạng thái đã hủy |  |
| ERR:7 | Tài khoản không phù hợp hoặc không tìm thấy company ứng với tài khoản đã khai báo |  |
| ERR:10 | Vượt quá giới hạn số thông tin hóa đơn truyền lên bằng token |  |
| ERR:20 | Không tìm thấy thông tin PublishInvoice |  |
| ERR:6 | Lỗi Exception |  |
| OK | Khôi phục hóa đơn thành công |  |

### Khôi phục hóa đơn bị thay thế bằng FKey

URL

string **restoreReplacedInvFkey** (string Account, string ACpass, string fkeyReplaced, string fkeyReplacedOld, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện k khôi phục hóa đơn bị thay thế bằng Fkey từ hóa đơn được thay về về hóa đơn bị thay thế

HTTP METHOD

POST

REQUEST BODY

*   **Account/** **ACpass**: Tài khoản truy cập CAdmin.
*   **fkeyReplaced:** FKey hóa đơn đang sử dụng (được thay thế, cần khôi phục về hóa đơn trước đó).
*   **fkeyReplacedOld:** FKey hóa đơn đã bị thay thế cần khôi phục lại về trạng thái sử dụng
*   **userName/userPass:** Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy hóa đơn hoặc có nhiều hơn 1 hóa đơn với tham số đã truyền |  |
| ERR:7 | Tài khoản không phù hợp hoặc không tìm thấy company ứng với tài khoản đã khai báo |  |
| ERR:8 | Hóa đơn thay thế đang không ở trạng thái có chứ ký của nhà phát hành |  |
| ERR:9 | Thông tin hóa đơn gốc và hóa đơn bị thay thế không chính xác |  |
| ERR:20 | Không tìm thấy thông tin PublishInvoice |  |
| ERR:6 | Lỗi Exception |  |
| OK | Khôi phục hóa đơn thành công |  |

### Khôi phục hóa đơn bị thay thế bằng Token

URL

string **restoreReplacedInvFkey** (string Account, string ACpass, string tokenReplaced, string tokenReplacedOld, string userName, string userPass)

DESCRIPTION

Đây là web service thực hiện k khôi phục hóa đơn bị thay thế bằng Token từ hóa đơn được thay về về hóa đơn bị thay thế

HTTP METHOD

POST

REQUEST BODY

*   **Account/** **ACpass**: Tài khoản truy cập CAdmin.
*   **tokenReplaced:** Chuỗi token xác định hóa đơn cần lấy(theo cấu trúc patternt;serial;sốhóađơn) của hóa đơn đang sử dụng (được thay thế, cần khôi phục về hóa đơn trước đó).
*   **tokenReplacedOld:** Chuỗi token xác định hóa đơn cần lấy(theo cấu trúc patternt;serial;sốhóađơn) của hóa đơn đã bị thay thế cần khôi phục lại về trạng thái sử dụng
*   **userName/userPass:** Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy hóa đơn hoặc có nhiều hơn 1 hóa đơn với tham số đã truyền |  |
| ERR:7 | Tài khoản không phù hợp hoặc không tìm thấy company ứng với tài khoản đã khai báo |  |
| ERR:8 | Hóa đơn thay thế đang không ở trạng thái có chứ ký của nhà phát hành |  |
| ERR:9 | Thông tin hóa đơn gốc và hóa đơn bị thay thế không chính xác |  |
| ERR:10 | Vượt quá giới hạn số thông tin hóa đơn truyền lên bằng token |  |
| ERR:20 | Không tìm thấy thông tin PublishInvoice |  |
| ERR:6 | Lỗi Exception |  |
| OK | Khôi phục hóa đơn thành công |  |

# Danh sách các hàm tích hợp thông tư 78

## Nhóm các hàm webservice tạo lập và phát hành hóa đơn (PublishService)

**Mô tả: các đầu hàm web service nằm trong PublishService.asmx, thực hiện các nghiệp vụ liên quan đến tạo lập, phát hành và xử lý hóa đơn**

### Phát hành hóa đơn

URL

String **ImportAndPublishInv**(string Account, string ACpass, string xmlInvData, string username, string password, string pattern = "", string serial = "", int convert = 0).

DESCRIPTION

Đây là web service cho phép phát hành hóa đơn với dữ liệu XML của khách hàng, tối đa cho 5000 hóa đơn.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: Chuỗi XML dữ liệu hóa đơn ( theo cấu trúc mô tả)
*   **pattern:** Mẫu số hóa đơn
*   **serial:** Ký hiệu hóa đơn
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định | Hệ thống sẽ trả về lỗi nếu 1 hóa đơn trong chuỗi XML đầu vào không hợp lệ, cả lô hóa đơn sẽ không được phát hành. |
| ERR:7 | Thông tin về Username/pass không hợp lệ |  |
| ERR:20 | Pattern và Serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng kí có sử dụng Pattern và Serial truyền vào. |  |
| ERR:5 | Không phát hành được hóa đơn | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| ERR:10 | Lô có số hóa đơn vượt quá số lượng cho phép |  |
| ERR:6 | Dải hóa đơn không đủ số hóa đơn cho lô phát hành |  |
| ERR:13 | Lỗi trùng fkey | 1 hoặc nhiều hóa đơn trong lô hóa đơn có Fkey trùng với Fkey của hóa đơn đã phát hành |
| ERR:21 | Lỗi trùng số hóa đơn |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| OK:pattern;serial1-key1_num1,key2_num12, …)(Ví dụ:OK:01GTKT3/001;AA/12E-key1_1,key2_2,key3_3,key4_4,key5_5) | OK 🡪 đã phát hành hóa đơn thành côngPattern 🡪 Mẫu số của các hóa đơn đã phát hànhSerial1 🡪 serial của dãy các hóa đơn phát hànhnum1, num2… là các số hóa đơnkey1,key2… là khóa để nhận biết hóa đơn phát hành cho khách hàng nào(lấy từ đầu vào) | Các hóa đơn có serial khác nhau phân cách bởi dấu “;”Các số hóa đơn phân cách bởi “,” |

**Định dạng chuỗi xml đầu vào (các trường \* là bắt buộc):**

<DSHDon>

<HDon>

<key>Fkey cua hoa don</key>

<DLHDon>

<TTChung>

<SHDon>Số hóa đơn</SHDon>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên \*</Ten>

<MST>Mã số thuế \*</MST>

<DChi>Địa chỉ \*</DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Bắt buộc đối với phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (Bắt buộc đối với phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat><!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</DLHDon>

</HDon>

</DSHDon>

### Phát hành hóa đơn theo số hóa đơn truyền vào

URL

String **ImportAndPublishAssignedNo**(string Account, string ACpass, string xmlInvData, string username, string password, int convert).

DESCRIPTION

Đây là web service cho phép phát hành hóa đơn với dữ liệu XML của khách hàng cho phép truyền số hóa đơn khi phát hành, tối đa cho 5000 hóa đơn.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: Chuỗi XML dữ liệu hóa đơn ( theo cấu trúc mô tả)
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định | Hệ thống sẽ trả về lỗi nếu 1 hóa đơn trong chuỗi XML đầu vào không hợp lệ, cả lô hóa đơn sẽ không được phát hành. |
| ERR:7 | Thông tin về Username/pass không hợp lệ |  |
| ERR:20 | Pattern và Serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng kí có sử dụng Pattern và Serial truyền vào. |  |
| ERR:5 | Không phát hành được hóa đơn | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| ERR:10 | Lô có số hóa đơn vượt quá số lượng cho phép |  |
| ERR:6 | Dải hóa đơn không đủ số hóa đơn cho lô phát hành |  |
| ERR:13 | Lỗi trùng fkey | 1 hoặc nhiều hóa đơn trong lô hóa đơn có Fkey trùng với Fkey của hóa đơn đã phát hành |
| ERR:21 | Lỗi trùng số hóa đơn |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:31 | Số hóa đơn truyền vào không hợp lệ |  |
| OK:pattern;serial1-key1_num1,key2_num12, …)(Ví dụ:OK:01GTKT3/001;AA/12E-key1_1,key2_2,key3_3,key4_4,key5_5) | OK 🡪 đã phát hành hóa đơn thành côngPattern 🡪 Mẫu số của các hóa đơn đã phát hànhSerial1 🡪 serial của dãy các hóa đơn phát hànhnum1, num2… là các số hóa đơnkey1,key2… là khóa để nhận biết hóa đơn phát hành cho khách hàng nào(lấy từ đầu vào) | Các hóa đơn có serial khác nhau phân cách bởi dấu “;”Các số hóa đơn phân cách bởi “,” |

**Định dạng chuỗi xml đầu vào (các trường \* là bắt buộc):**

<DSHDon>

<HDon>

<key>Fkey cua hoa don</key>

<DLHDon>

<InvoiceNo>Số hóa đơn truyền vào \*</InvoiceNo>

<TTChung>

<SHDon>Số hóa đơn</SHDon>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên \*</Ten>

<MST>Mã số thuế \*</MST>

<DChi>Địa chỉ \*</DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Bắt buộc đối với phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (Bắt buộc đối với phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat><!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</DLHDon>

</HDon>

</DSHDon>

### Thêm mới hóa đơn

URL

string string **ImportInv**(string xmlInvData, string username, string password, int convert = 0)

DESCRIPTION

Đây là web service cho phép tạo mới hóa đơn từ chuỗi xml đầu vào theo chuẩn mô tả

HTTP METHOD

POST

REQUEST BODY

*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData:** Chuỗi xml chứa thông tin hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai |  |
| ERR:3 | Định dạng xml của hóa đơn sai cấu trúc |  |
| ERR:5 | Không tìm thấy công ty | Mặc định 5000 hoặc theo cấu hình từng app |
| ERR:20 | Pattern và serial không hợp lệ |  |
| ERR:6 | Không còn dư số hóa đơn để phát hành |  |
| ERR:10 | Vượt quá số lượng hóa đơn tạo cho phép (không được vượt quá 5000HĐ) |  |
| ERR:5 | Lỗi hệ thống |  |
| "OK:" + pattern + ";" + serial + "-" + invKeyList | Tạo hóa đơn thành công | Trả về message OK kèm theo Pattern, Serial và danh sách fkey hóa đơn tạo mới thành công |

**Định dạng chuỗi xml đầu vào (các trường \* là bắt buộc):**

<DSHDon>

<HDon>

<key>Fkey cua hoa don</key>

<DLHDon>

<TTChung>

<SHDon>Số hóa đơn</SHDon>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên \*</Ten>

<MST>Mã số thuế \*</MST>

<DChi>Địa chỉ \*</DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Bắt buộc đối với phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (Bắt buộc đối với phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat><!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</DLHDon>

</HDon>

</DSHDon>

### Thêm mới hóa đơn theo mẫu số, ký hiệu

URL

string **ImportInvByPattern**(string Account, string ACpass, string xmlInvData, string username, string password, string pattern = "", string serial = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép thêm mới hóa đơn từ dữ liệu XML gửi lên

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml hóa đơn ( theo mô tả)
*   **pattern**: mẫu số hóa đơn
*   **serial**: ký hiệu hóa đơn
*   **convert:** Mặc định là 0, 0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:6 | Không đủ số lượng hóa đơn cho lô thêm mới |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:13 | Danh sách hóa đơn tồn tại hóa đơn trùng Fkey |  |
| ERR:22 | Trùng số hóa đơn |  |
| ERR:7 | Pattern và serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng ký có sử dụng Pattern và Serial truyền vào | Chỉ chấp nhận đồng thời nhập cả Pattern và serial hoặc đồng thời để trống cả pattern và serial |
| ERR:5 | Không phát hành được hóa đơn | Lỗi không xác định. DB roll back |
| ERR:10 | Lô có số hóa đơn vượt quá max cho phép | Mặc định là 5000, hoặc được cấu hình theo từng app |
| OK: pattern;serial1-key1_num1,key2_num12,key3_num3…(Ví dụ:OK:01GTKT3/001;AA/12E-key1_1,key2_2,key3_3,key4_4,key5_5) | OK 🡪 đã phát hành hóa đơn thành côngPattern 🡪 Mẫu số của các hóa đơn đã phát hànhSerial1 🡪 serial của dãy các hóa đơn phát hànhnum1, num2… là các số hóa đơnkey1,key2… là khóa để nhận biết hóa đơn phát hành cho khách hàng nào(lấy từ đầu vào) | Cách hóa đơn có serial khác nhau phân cách bởi dấu “;”Các số hóa đơn phân cách bởi “,” |

**Định dạng chuỗi xml đầu vào (các trường \* là bắt buộc):**

<DSHDon>

<HDon>

<key>Fkey cua hoa don</key>

<DLHDon>

<TTChung>

<SHDon>Số hóa đơn</SHDon>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên \*</Ten>

<MST>Mã số thuế \*</MST>

<DChi>Địa chỉ \*</DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Bắt buộc đối với phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (Bắt buộc đối với phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat><!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</DLHDon>

</HDon>

</DSHDon>

### Lấy nội dung XMLData Hóa đơn có mã CQT trả về

URL

string **GetInvDataByFkey**(string fkey, string userName, string userPass, string account, string accPass, string pattern = "")

DESCRIPTION

Đây là web service cho phép lấy nội dung xml hóa đơn có mã CQT trả về

HTTP METHOD

Get

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **fkey**: fkey của hóa đơn
*   **pattern**: mẫu số hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:78 | Khách hàng không sử dụng hóa đơn cấp mã từ cơ quan thuế hoặc không cấu hình sử dụng theo TT78 |  |
| ERR:21 | Không lấy được mẫu mặc định của công ty |  |
| ERR:22 | Không lấy được invoice service theo mẫu số truyền vào |  |
| ERR:23 | Fkey truyền vào không đúng |  |
| ERR:24 | Không lấy được InvoiceData theo hóa đơn, hóa đơn có thể chưa được cấp mã. |  |
| ERR:25 | Trường InvoiceData chưa được lưu ở hóa đơn |  |
| ERR:5 | Lỗi không xác định, không lấy được dữ liệu hóa đơn cấp mã theo dữ liệu truyền vào |  |
| DataBase64 | Dữ liệu xml hóa đơn có mã CQT dạng Base64 |  |

### Lấy trạng thái và XMLData hóa đơn có mã, trạng thái của hóa đơn không mã gửi CQT trả về theo danh sách invToken

URL

string **GetMCCQThueByInvTokens**(string Account, string ACpass, string username, string password, string invTokens)

DESCRIPTION

Đây là web service cho phép lấy trạng thái và nội dung xml hóa đơn có mã CQT trả về theo invToken

HTTP METHOD

Get

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invTokens**: danh sách chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn |  |
| ERR:2 | Không tìm thấy hóa đơn tương ứng. |  |
| ERR:10 | Vượt quá số lượng 100 hóa đơn cần lấy |  |
| ERR:20 | Không lấy được thông tin người dùng |  |
| ERR:5 | Lỗi không xác định, không lấy được dữ liệu hóa đơn cấp mã theo dữ liệu truyền vào |  |
| DataBase64 | Dữ liệu thông tin hóa đơn ở dạng XML đã base64 bao gồm: mẫu số, ký hiệu, số, trạng thái cấp mã, xml hóa đơn<DSHDon><HDon><KHMSHDon>Mẫu số hóa đơn</KHMSHDon><KHHDon>Ký hiệu hóa đơn</KHHDon><SHDon>Số hóa đơn</SHDon><MCCQThue>Mã cơ quan thuế cấp (Trường hợp hóa đơn có mã)</MCCQThue><TThai>0: Chưa gửi cơ quan thuế1: Đã gửi cơ quan thuế2: Đã được CQT chấp nhận3: Đã bị CQT từ chối</TThai><MTLoi>thông báo lỗi CQT trả về</MTLoi><Fkey>Fkey hóa đơn</Fkey></HDon></DSHDon> |  |

### Lấy trạng thái và XMLData hóa đơn có mã, trạng thái của hóa đơn không mã gửi CQT trả về theo danh sách Fkey

URL

string **GetMCCQThueByFkeys** (string Account, string ACpass, string username, string password, string pattern, string fkeys)

DESCRIPTION

Đây là web service cho phép lấy trạng thái và nội dung xml hóa đơn có mã CQT trả về theo invToken

HTTP METHOD

Get

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Pattern**: mẫu số hóa đơn
*   **fkeys**: danh sách chuỗi fkey xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn |  |
| ERR:2 | Không tìm thấy hóa đơn tương ứng. |  |
| ERR:10 | Vượt quá số lượng 100 hóa đơn cần lấy |  |
| ERR:20 | Không lấy được thông tin người dùng |  |
| ERR:5 | Lỗi không xác định, không lấy được dữ liệu hóa đơn cấp mã theo dữ liệu truyền vào |  |
| DataBase64 | Dữ liệu thông tin hóa đơn ở dạng XML đã base64 bao gồm: mẫu số, ký hiệu, số, trạng thái cấp mã, xml hóa đơn<DSHDon><HDon><KHMSHDon>Mẫu số hóa đơn</KHMSHDon><KHHDon>Ký hiệu hóa đơn</KHHDon><SHDon>Số hóa đơn</SHDon><MCCQThue>Mã cơ quan thuế cấp (Trường hợp hóa đơn có mã)</MCCQThue><TThai>0: Chưa gửi cơ quan thuế1: Đã gửi cơ quan thuế2: Đã được CQT chấp nhận3: Đã bị CQT từ chối</TThai><MTLoi>thông báo lỗi CQT trả về</MTLoi><Fkey>Fkey hóa đơn</Fkey></HDon></DSHDon> |  |

### Lấy trạng thái hóa đơn có mã, hóa đơn không mã gửi CQT trả về theo danh sách invToken

URL

string GetMCCQThueByInvTokensNoXMLSign(string Account, string ACpass, string username, string password, string invTokens)

DESCRIPTION

Đây là web service cho phép lấy trạng thái và nội dung xml hóa đơn có mã CQT trả về theo invToken

HTTP METHOD

Get

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invTokens**: danh sách chuỗi token xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn |  |
| ERR:2 | Không tìm thấy hóa đơn tương ứng. |  |
| ERR:10 | Vượt quá số lượng 100 hóa đơn cần lấy |  |
| ERR:20 | Không lấy được thông tin người dùng |  |
| ERR:5 | Lỗi không xác định, không lấy được dữ liệu hóa đơn cấp mã theo dữ liệu truyền vào |  |
| DataBase64 | Dữ liệu thông tin hóa đơn ở dạng XML đã base64 bao gồm: mẫu số, ký hiệu, số, trạng thái cấp mã, xml hóa đơn<DSHDon><HDon><KHMSHDon>Mẫu số hóa đơn</KHMSHDon><KHHDon>Ký hiệu hóa đơn</KHHDon><SHDon>Số hóa đơn</SHDon><MCCQThue>Mã cơ quan thuế cấp (Trường hợp hóa đơn có mã)</MCCQThue><TThai>0: Chưa gửi cơ quan thuế1: Đã gửi cơ quan thuế2: Đã được CQT chấp nhận3: Đã bị CQT từ chối</TThai><MTLoi>thông báo lỗi CQT trả về</MTLoi><Fkey>Fkey hóa đơn</Fkey></HDon></DSHDon> |  |

### Lấy trạng thái hóa đơn có mã, hóa đơn không mã gửi CQT trả về theo danh sách Fkey

URL

string GetMCCQThueByFkeysNoXMLSign(string Account, string ACpass, string username, string password, string pattern, string fkeys)

DESCRIPTION

Đây là web service cho phép lấy trạng thái và nội dung xml hóa đơn có mã CQT trả về theo invToken

HTTP METHOD

Get

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Pattern**: mẫu số hóa đơn
*   **fkeys**: danh sách chuỗi fkey xác định hóa đơn cần lấy

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn |  |
| ERR:2 | Không tìm thấy hóa đơn tương ứng. |  |
| ERR:10 | Vượt quá số lượng 100 hóa đơn cần lấy |  |
| ERR:20 | Không lấy được thông tin người dùng |  |
| ERR:5 | Lỗi không xác định, không lấy được dữ liệu hóa đơn cấp mã theo dữ liệu truyền vào |  |
| DataBase64 | Dữ liệu thông tin hóa đơn ở dạng XML đã base64 bao gồm: mẫu số, ký hiệu, số, trạng thái cấp mã, xml hóa đơn.<DSHDon><HDon><KHMSHDon>Mẫu số hóa đơn</KHMSHDon><KHHDon>Ký hiệu hóa đơn</KHHDon><SHDon>Số hóa đơn</SHDon><MCCQThue>Mã cơ quan thuế cấp (Trường hợp hóa đơn có mã)</MCCQThue><TThai>0: Chưa gửi cơ quan thuế1: Đã gửi cơ quan thuế2: Đã được CQT chấp nhận3: Đã bị CQT từ chối</TThai><MTLoi>thông báo lỗi CQT trả về</MTLoi><Fkey>Fkey hóa đơn</Fkey></HDon></DSHDon> |  |

### Gửi thông điệp hóa đơn điện tử có sai sót.

URL

string **SendInvNoticeErrors**(string Account, string ACpass, string xml, string username, string password, string pattern = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép gửi thông điệp hóa đơn điện tử có sai sót bằng hsm hoặc p12.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xml**: chuỗi xml thông điệp hóa đơn điện tử có sai sót (theo mẫu mô tả kèm theo)
*   **pattern**: mẫu số hóa đơn
*   **convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:10 | Lô có số hóa đơn vượt quá số lượng tối đa cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| OK:mtd | Gửi thông điệp thành công, trả về mã thông điệp |  |

Cấu trúc chuỗi XML đầu vào của thông điệp: (dấu \* là bắt buộc)

<DLTBao>

    <TNNT></TNNT>\* //Tên người nộp thuế

    <TCQT></TCQT>\*//Tên cơ quan thuế (Tên cơ quan thuế ra thông báo)

    <NTBao></NTBao>\*//Ngày thông báo

    <DDanh></DDanh>\*//Địa danh

    <Loai> </Loai>\*//Loại (Loại thông báo) (1: Thông báo hủy/giải trình của NNT, 2: Thông báo hủy/giải trình của NNT theo thông báo của CQT)

    <So></So> //Số thông báo của CQT. Bắt buộc (Đối với Loại=2: Thông báo hủy/giải trình của NNT theo thông báo của CQT)

    <NTBCCQT></NTBCCQT>//Ngày thông báo của CQT. Bắt buộc (Đối với Loại=2: Thông báo hủy/giải trình của NNT theo thông báo của CQT)

    <DSHDon>

        <HDon>

            <STT></STT> //Số thứ tự

            <MCQTCap> </MCQTCap> //Mã CQT cấp. Bắt buộc (Trừ trường hợp là hóa đơn không có mã của CQT)

            <KHMSHDon></KHMSHDon>\* //Ký hiệu mẫu số hóa đơn

            <KHHDon></KHHDon>\*//Ký hiệu hóa đơn

            <SHDon></SHDon>\*//Số hóa đơn (Số hóa đơn điện tử)

            <Ngay></Ngay>\*//Ngày (Ngày lập hóa đơn) - định dạng: YYYY-MM-YY

            <LADHDDT></LADHDDT>\*//Loại áp dụng hóa đơn điện tử

            (1:Hóa đơn điện tử theo Nghị định 123/2020/NĐ-CP;

            2: Hóa đơn điện tử có mã xác thực của cơ quan thuế theo Quyết định số 1209/QĐ-BTC;

            3: Hóa đơn theo Nghị định số 51/2010/NĐ-CP và Nghị định số 04/2014/NĐ-CP;

            4: Hóa đơn đặt in theo Nghị định 123/2020/NĐ-CP)

            <TCTBao></TCTBao> \*//Tính chất thông báo (1: Hủy; 2: Điều chỉnh; 3: Thay thế; 4: Giải trình)

            <LDo></LDo> //Lý do

            <Fkey></Fkey>

        </HDon>

    </DSHDon>

</DLTBao>

### Lấy giá trị Hash cho gửi thông điệp hóa đơn có sai sót bằng token ( bước 1)

URL

string **GetHashInvNoticeErrors**(string Account, string ACpass, string xml, string username, string password, string pattern = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép gửi thông điệp hóa đơn điện tử có sai sót với các hệ thống sử dụng token, thực hiện truyền dữ liệu hóa đơn và lấy giá trị hash value để ký số bằng token ở client.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xml**: chuỗi xml thông điệp hóa đơn điện tử có sai sót (theo mẫu mô tả kèm theo)
*   **pattern**: mẫu số hóa đơn
*   **convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:10 | Lô có số hóa đơn vượt quá số lượng tối đa cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| Chuỗi base64Hash | Chuỗi trả về sử dụng để ký số token |  |

Cấu trúc chuỗi XML đầu vào của thông điệp: (dấu \* là bắt buộc)

<DLTBao>

    <TNNT></TNNT>\* //Tên người nộp thuế

    <TCQT></TCQT>\*//Tên cơ quan thuế (Tên cơ quan thuế ra thông báo)

    <NTBao></NTBao>\*//Ngày thông báo

    <DDanh></DDanh>\*//Địa danh

    <Loai> </Loai>\*//Loại (Loại thông báo) (1: Thông báo hủy/giải trình của NNT, 2: Thông báo hủy/giải trình của NNT theo thông báo của CQT)

    <So></So> //Số thông báo của CQT. Bắt buộc (Đối với Loại=2: Thông báo hủy/giải trình của NNT theo thông báo của CQT)

    <NTBCCQT></NTBCCQT>//Ngày thông báo của CQT. Bắt buộc (Đối với Loại=2: Thông báo hủy/giải trình của NNT theo thông báo của CQT)

    <DSHDon>

        <HDon>

            <STT></STT> //Số thứ tự

            <MCQTCap> </MCQTCap> //Mã CQT cấp. Bắt buộc (Trừ trường hợp là hóa đơn không có mã của CQT)

            <KHMSHDon></KHMSHDon>\* //Ký hiệu mẫu số hóa đơn

            <KHHDon></KHHDon>\*//Ký hiệu hóa đơn

            <SHDon></SHDon>\*//Số hóa đơn (Số hóa đơn điện tử)

            <Ngay></Ngay>\*//Ngày (Ngày lập hóa đơn) - định dạng: YYYY-MM-YY

            <LADHDDT></LADHDDT>\*//Loại áp dụng hóa đơn điện tử

            (1:Hóa đơn điện tử theo Nghị định 123/2020/NĐ-CP;

            2: Hóa đơn điện tử có mã xác thực của cơ quan thuế theo Quyết định số 1209/QĐ-BTC;

            3: Hóa đơn theo Nghị định số 51/2010/NĐ-CP và Nghị định số 04/2014/NĐ-CP;

            4: Hóa đơn đặt in theo Nghị định 123/2020/NĐ-CP)

            <TCTBao></TCTBao> \*//Tính chất thông báo (1: Hủy; 2: Điều chỉnh; 3: Thay thế; 4: Giải trình)

            <LDo></LDo> //Lý do

            <Fkey></Fkey>

        </HDon>

    </DSHDon>

</DLTBao>

Cấu trúc chuỗi base64Hash trả về:

Qp0OIf1ZAMA5tHpzdJtqIV0rlZc=

### Gửi thông điệp hóa đơn điện tử có sai sót sử dụng token (bước 2)

URL

string **SendInvNoticeErrorsWidthToken(**string Account, string ACpass, string username, string password, string xml**)**

DESCRIPTION

Đây là web service cho phép gửi thông điệp hóa đơn điện tử có sai sót với các hệ thống sử dụng token, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**3.1.9**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xml**: chuỗi xml dữ liệu ký hash.
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền phát hành hóa đơn |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:10 | Lô có số hóa đơn vượt quá max cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| OK:mtd | Gửi thông điệp thành công, trả về mã thông điệp |  |

**Cấu trúc chuỗi xml truyền lên:**

<CKS>

    <SerialCert></SerialCert> \*//serial chứng thư của công ty

    <Base64Hash></Base64Hash> \*//chuỗi Hash lấy từ bước 3.1.9

    <SignValue></SignValue> \*//chuỗi ký

</CKS>

### Lấy giá trị Hash cho gửi thông điệp hóa đơn có sai sót bằng SmartCA ( bước 1)

URL

string **GetHashInvNoticeErrorsWithSmartCA**(string Account, string ACpass, string xml, string username, string password, string serial, string pattern = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép gửi thông điệp hóa đơn điện tử có sai sót với các hệ thống sử dụng smartCA, thực hiện truyền dữ liệu hóa đơn sai sót và lấy giá trị hash value để ký số bằng smartCA ở client.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:**  Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xml**: chuỗi xml thông điệp hóa đơn điện tử có sai sót (theo mẫu mô tả kèm theo)    
*   **serial**: serial của chứng thư SmartCA công ty đã đăng ký trong hệ thống
*   **pattern**: mẫu số hóa đơn
*   **convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:10 | Lô có số hóa đơn vượt quá số lượng tối đa cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| Chuỗi hash | Chuỗi trả về sử dụng để ký số smartCA |  |

Cấu trúc chuỗi XML đầu vào của thông điệp: (dấu \* là bắt buộc)

<DLTBao>

    <TNNT></TNNT>\* //Tên người nộp thuế

    <TCQT></TCQT>\*//Tên cơ quan thuế (Tên cơ quan thuế ra thông báo)

    <NTBao></NTBao>\*//Ngày thông báo

    <DDanh></DDanh>\*//Địa danh

    <Loai> </Loai>\*//Loại (Loại thông báo) (1: Thông báo hủy/giải trình của NNT, 2: Thông báo hủy/giải trình của NNT theo thông báo của CQT) 

    <So></So> //Số thông báo của CQT. Bắt buộc (Đối với Loại=2: Thông báo hủy/giải trình của NNT theo thông báo của CQT)

    <NTBCCQT></NTBCCQT>//Ngày thông báo của CQT. Bắt buộc (Đối với Loại=2: Thông báo hủy/giải trình của NNT theo thông báo của CQT) 

    <DSHDon>

        <HDon>

            <STT></STT> //Số thứ tự

            <MCQTCap> </MCQTCap> //Mã CQT cấp. Bắt buộc (Trừ trường hợp là hóa đơn không có mã của CQT)

            <KHMSHDon></KHMSHDon>\* //Ký hiệu mẫu số hóa đơn

            <KHHDon></KHHDon>\*//Ký hiệu hóa đơn

            <SHDon></SHDon>\*//Số hóa đơn (Số hóa đơn điện tử)

            <Ngay></Ngay>\*//Ngày (Ngày lập hóa đơn) - định dạng: YYYY-MM-YY

            <LADHDDT></LADHDDT>\*//Loại áp dụng hóa đơn điện tử 

            (1:Hóa đơn điện tử theo Nghị định 123/2020/NĐ-CP; 

            2: Hóa đơn điện tử có mã xác thực của cơ quan thuế theo Quyết định số 1209/QĐ-BTC;

            3: Hóa đơn theo Nghị định số 51/2010/NĐ-CP và Nghị định số 04/2014/NĐ-CP;

            4: Hóa đơn đặt in theo Nghị định 123/2020/NĐ-CP)

            <TCTBao></TCTBao> \*//Tính chất thông báo (1: Hủy; 2: Điều chỉnh; 3: Thay thế; 4: Giải trình)

            <LDo></LDo> //Lý do

            <Fkey></Fkey>

        </HDon>

    </DSHDon>

</DLTBao>

Cấu trúc chuỗi Hash trả về:

tFcVc/SWLPX+kbJ/uNzlVYBNNeoWlAIAQ0RmkGaYgqs=

### Gửi thông điệp hóa đơn điện tử có sai sót sử dụng SmartCA (bước 2)

URL

string **SendInvNoticeErrorsWithSmartCA(**string Account, string ACpass, string username, string password, string xml**)** 

DESCRIPTION

Đây là web service cho phép gửi thông điệp hóa đơn điện tử có sai sót với các hệ thống sử dụng SmartCA, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước **GetHashInvNoticeErrorsWidthSmartCA**

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:**  Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xml**: chuỗi xml dữ liệu ký hash. 
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền phát hành hóa đơn |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:10 | Lô có số hóa đơn vượt quá max cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| OK:mtd | Gửi thông điệp thành công, trả về mã thông điệp |  |

**Cấu trúc chuỗi xml truyền lên:**

<CKS>

    <SerialCert></SerialCert> \*//serial chứng thư của công ty

    <HashValue></HashValue > \*//chuỗi Hash lấy từ bước 1

    <SignValue></SignValue> \*//chuỗi ký

</CKS>

### Nhận kết quả thông điệp hóa đơn sai sót

URL

string **ReceivedInvoiceErrors** (string Account, string ACpass, string username, string password, string mtd)

DESCRIPTION

Đây là web service nhận kết quả phản hồi của thuế theo mã thông điệp

HTTP METHOD

GET

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Mtd:** Mã thông điệp thuế trả về sau khi gọi hàm gửi thông điệp

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Mã thông điệp không họp lệ, không tìm thấy bản ghi transaction |  |
| ERR:8 | Lỗi nhận kết quả từ cơ quan thuế |  |
| ERR:7 | Không tìm thấy chi tiết hóa đơn sai sót |  |
| ERR:4 | Chưa có kêt quả thuế trả về, trạng thái chi tiết chưa được cập nhật |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| OK:mtd:dshoadon | Nhận kết quả thành công, trả về mã thông điêp và danh sách hóa đơn bị lỗi |  |

### Xử lý kêt quả thông điệp hóa đơn sai sót

URL

string **HandleInvoiceErrors** (string Account, string ACpass, string username, string password, string mtd)

DESCRIPTION

Đây là web service xử lý cập nhật trạng thái hủy hóa đơn mới và khôi phục trạng thái óa đơn gốc trường hợp những hóa đơn gửi sai sót bị thuế từ chối

HTTP METHOD

GET

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Mtd:** Mã thông điệp thuế trả về sau khi gọi hàm gửi thông điệp

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Mã thông điệp không họp lệ, không tìm thấy bản ghi transaction |  |
| ERR:8 | Không tìm thấy danh sách hóa đơn hủy để gửi mẫu 04, không có hóa đơn thuế từ chối |  |
| ERR:7 | Không tìm thấy chi tiết hóa đơn sai sót |  |
| ERR:4 | Chưa có kêt quả thuế trả về, trạng thái chi tiết chưa được cập nhật |  |
| ERR:6 | Có lỗi xảy ra trong quá trình update trạng thái hóa đơn sai sót |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:51 | Verify chứng thư lỗi |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| OK:mtd | Trường hợp ký số HSM: cập nhật trạng thái thành công, tự động gửi mẫu 04, kêt quả trả về mã thông điệp |  |
| OK:xml | Trường hợp ký số token: cập nhật trạng thái thành công, kết quả trả về Xml để thực hiện thao tác gọi webservice gửi thông điệp sai sót bằng token |  |

### Lấy danh sách lịch sử truyền nhận CQT theo tham số truyền vào và phân trang

URL

string **GetTransactionItems** (string **username**, string **password**, int **status**, string **mtdiep**, string **message**, string **fromDate**, string **toDate**, string **mltdiep**, string **pattern**, string **serial**, decimal **invNo**, int **step**, int **pageIndex**, int **pageSize**)

DESCRIPTION

Đây là web service lấy danh sách lịch sử truyền nhận lên CQT theo tham số tìm kiếm và phân trang

HTTP METHOD

GET

REQUEST BODY

*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Status:** Trạng thái (giá trị -1 sẽ là lấy tất cả)
*   **Mtdiep:** Mã thông điệp
*   **Message:** Nội dung thông điệp truyền về
*   **FromDate:** Ngày bắt đầu (dd/MM/yyyy)
*   **ToDate:** Ngày kết thúc (dd/MM/yyyy)
*   **Mltdiep:** Mã loại thông điệp (để trống sẽ lấy tất cả)
*   **Pattern:** Mẫu số hóa đơn
*   **Serial:** Ký hiệu hóa đơn
*   **InvNo:** Số hóa đơn (giá trị 0 sẽ là lấy tất cả)
*   **Step:** Step của lịch sử truyền nhận (giá trị -2 sẽ là lấy tất cả)
*   **PageIndex:** Lấy trang hiện tại
*   **PageSize:** Số bản ghi trong 1 trang

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:7 | Không tìm thấy công ty đăng nhập |  |
| ERR:12 | Định dạng ngày tháng không đúng | dd/MM/yyyy |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| OK:base64 | Danh sách lịch sử truyền nhận theo base64 |  |

**Ghi chú**: các giá trị bắt buộc với tham số truyền vào đang được cấu hình cố định

*   **Status** (định dạng số (int))
    *   \-1: Giá trị mặc định, lấy tất cả
    *   5: Đã gửi TDiep tới TCTN
    *   6: Lỗi kết nối tới TCTN
    *   7: Gửi TCTN thất bại
    *   8: TCTN đã nhận được TDiep
    *   9: TCTN đã tiếp nhận và chưa xử lý
    *   10: TCTN đã phản hồi TDiep kỹ thuật
    *   11: TCTN đã gửi TDiep lên CQT
    *   12: TCT đã phản hồi TDiep kỹ thuật
    *   13: TCT đã phản hồi kết quả TDiep
    *   16: Lỗi kết nối cơ quan thuế
*   **Step** (định dạng số (int))
    *   \-2: Giá trị mặc định, lấy tất cả
    *   17: Tiếp nhận Tờ khai đăng ký sử dụng hóa đơn điện tử
    *   18: Không tiếp nhận Tờ khai đăng ký sử dụng hóa đơn điện tử
    *   19: Tiếp nhận Tờ khai đăng ký thay đổi thông tin sử dụng hóa đơn điện tử
    *   20: Không tiếp nhận Tờ khai đăng ký thay đổi thông tin sử dụng hóa đơn điện tử
    *   21: Chấp nhận đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử.
    *   22: Không chấp nhận đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử!
    *   23: TCTN tiếp nhận lỗi
    *   24: TCTN tiếp nhận thành công
    *   25: Thông báo hóa đơn không đủ điều kiện cấp mã
    *   26: Thông báo kết quả đối chiếu thông tin gói dữ liệu hợp lệ
    *   27: Thông báo kết quả đối chiếu thông tin sơ bộ từng hóa đơn không mã không hợp lệ
    *   28: Thông báo kết quả đối chiếu sơ bộ thông tin của Bảng tổng hợp khác xăng dầu, Tờ khai dữ liệu hóa đơn, chứng từ hàng hóa, dịch vụ bán ra không hợp lệ
    *   29: Thông báo kết quả đối chiếu sơ bộ thông tin của Bảng tổng hợp xăng dầu không hợp lệ
    *   30: Thông báo kết quả đối chiếu sơ bộ thông tin Đơn đề nghị cấp hóa đơn điện tử có mã của CQT theo từng lần phát sinh với trường hợp NNT gửi đơn qua cổng thông tin điện tử của TCT
    *   31: Thông báo kết quả đối chiếu thông tin gói dữ liệu không hợp lệ các trường hợp khác
    *   32: TCT tiếp nhận lỗi
    *   33: TCT tiếp nhận thành công
    *   34: TCT cấp mã hóa đơn thành công!
    *   35: TCT thông báo kết quả đối chiếu thông tin gói dữ liệu hóa đơn sai sót hợp lệ
*   **Mltdiep** (định dạng chữ (string))
    *   100: Thông điệp gửi tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử
    *   101: Thông điệp gửi tờ khai đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hóa đơn
    *   106: Thông điệp gửi Đơn đề nghị cấp hóa đơn điện tử có mã của CQT theo từng lần phát sinh
    *   200: Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã
    *   201: Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã theo từng lần phát sinh
    *   203: Thông điệp chuyển dữ liệu hóa đơn điện tử không mã đến cơ quan thuế
    *   300: Thông điệp thông báo về hóa đơn điện tử đã lập có sai sót
    *   400: Thông điệp chuyển bảng tổng hợp dữ liệu hóa đơn điện tử đến cơ quan thuế
    *   500: Thông điệp chuyển dữ liệu hóa đơn điện tử do TCTN uỷ quyền cấp mã đến cơ quan thuế
*   **InvNo** (định dạng số (decima))
    *   0: Giá trị mặc định sẽ lất tất cả

### Xem chi tiết bản ghi trong lịch sử truyền nhận

URL

string GetTransactionDetail (string username, string password, string mtd)

DESCRIPTION

Đây là web service xem chi tiết bản ghi lịch sử truyền nhận

HTTP METHOD

GET

REQUEST BODY

*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Mtd:** Mã thông điệp thuế trả về sau khi gọi hàm gửi thông điệp

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy công ty đăng nhập |  |
| ERR:3 | Mã thông điệp không thuộc công ty tra cứu |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| OK:base64 | Chi tiết bản ghi trả về dưới dạng Base64 |  |

### Xem chi tiết step CQT trả về

URL

string **GetStepDetail** (string **username**, string **password**, string **stepId,** string **mtd**)

DESCRIPTION

Đây là web service xem chi tiết step CQT trả kết quả về

HTTP METHOD

GET

REQUEST BODY

*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **stepId:** Id step được trả kết quả trên hàm **GetTransactionDetail**
*   **Mtd:** Mã thông điệp thuế trả về sau khi gọi hàm gửi thông điệp

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy công ty đăng nhập |  |
| ERR:3 | Mã thông điệp không thuộc công ty tra cứu |  |
| ERR:4 | Tham số truyền vào rỗng |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| OK:base64 | Chi tiết bản ghi trả về dưới dạng Base64 |  |

### Nhận kết quả lịch sự truyền nhận

URL

String GetResultsTransaction (string **username**, string **password,** int Id,bool **tranErr = true)**

DESCRIPTION

Đây là webservice nhận kết quả lịch sự truyền nhận

HTTP METHOD

POST

REQUEST BODY

*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Id:** Id của Packagetranscation trong **chi tiết step CQT trả về**
*   **TranErr:** true : trường hợp lỗi màn hinh xem chi tiết cho nhận lại, false: trường hợp nhận từ màn hinh danh sách

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy công ty đăng nhập |  |
| ERR:3 | Mã thông điệp không thuộc công ty tra cứu |  |
| ERR:4 | Tham số truyền vào rỗng |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:6 | Sai trạng thái |  |
| Ok:kết quả | Thông báo kết quả nhận kết quả |  |

### Đăng ký tờ khai DK01

URL

String RegisterPublish(string Account, string ACpass, string xmlInvData, string username, string password, int type)

DESCRIPTION

Đây là web service cho phép đăng ký tờ khai 01.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :**  Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: Chuỗi XML dữ liệu tờ khai 01 đã ký số ( theo cấu trúc mô tả)
*   **type:** \=0

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| ERR:11 | Dữ liệu xml validate lỗi |  |
| ERR:6 | Lỗi gửi dữ liệu đăng ký lên TCTN |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| OK: mtd | Đã gửi tờ khai 01 lên TCT: mã thông điệp |  |

### Lấy kết quả tờ khai DK01

URL

String ReceivedRegisterPublish(string Account, string ACpass, string username, string password, string mtd)

DESCRIPTION

Đây là web service cho phép đăng ký tờ khai 01.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :**  Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **mtd**: Mã thông điệp tờ khai 01

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| ERR:11 | Dữ liệu xml validate lỗi |  |
| ERR:6 | Không tìm thấy thông điệp |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| ERR: 7 | Lỗi dữ liệu trả về từ TCTN |  |
| OK: xml | XML kết quả TCT trả về |  |

### Đăng ký dải số

URL

RegisterPublishInvoice(string Account, string ACpass, string username, string password, string Pattern, string Type, string Serial, int Quantity)

DESCRIPTION

Đây là web service cho phép đăng ký dải số.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :**  Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **Pattern**: Mẫu số
*   **Serial**: Kí hiệu
*   **Quantity**: Số lượng
*   **type:** \=0

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| OK | Thành công |  |

### Hủy dải số

URL

CancelPublishInvoice(string Account, string ACpass, string username, string password, string Pattern, string Serial)

DESCRIPTION

Đây là web service cho phép huỷ dải số.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :**  Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **Pattern**: Mẫu số
*   **Serial**: Kí hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| OK | Thành công |  |

### Lấy giá trị Hash cho phát hành hóa đơn SmartCa ( bước 1)

URL

string **GetHashInvSmartCA**(string Account, string ACpass, string xmlInvData, string username, string password, string serialCert, int type, string invToken, string pattern = "", string serial = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép phát hành hóa đơn với các hệ thống sử dụng smartCA, thực hiện truyền dữ liệu hóa đơn và lấy giá trị hash value để ký số bằng smartCA ở client.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml hóa đơn (theo mẫu mô tả kèm theo)
*   **serialCert**: Serial của chứng thư số công ty đã đăng ký trong hệ thống
*   **type**: phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4
*   **invToken**: chuỗi token hóa đơn = mẫu số;ký hiệu;số hóa đơn (ví dụ: 01GTKT0/001;AA/17E;1) – chỉ cần khi thay thế/ điều chỉnh; phát hành thì để trống
*   **pattern**: mẫu số hóa đơn
*   **serial**: ký hiệu hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và Serial không phù hợp |  |
| ERR:6 | Không còn đủ số lượng hóa đơn để phát hành |  |
| ERR:10 | Lô có số hóa đơn vượt quá số lượng tối đa cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| Chuỗi xml trả về | Chuỗi trả về |  |

Cấu trúc chuỗi XML trả về:

<Invoices>

<Inv>

<key>**123**</key>

<idInv>**128668**</idInv>

<hashValue>**rKdYgeYc7CYLOhjfNFDZ8nBaWjA=**</hashValue>

<pattern>**01GTKT0/001**</pattern>

<serial>**AA/17E**</serial>

</Inv>

<Inv>

<key>**456**</key>

<idInv>**128923**</idInv>

<hashValue>**2p60p82YQhqjMHG9t/toIaLfENQ=**</hashValue>

<pattern>**01GTKT0/001**</pattern>

<serial>**AA/17E**</serial>

</Inv>

</Invoices>

Trong đó: tag <key>: fkey

tag <idInv>: id hóa đơn trên hệ thống vnpt

tag <hashValue>: chuỗi hash

tag <pattern>: mẫu số

tag <serial>: ký hiệu

### Phát hành hóa đơn sử dụng SmartCA (bước 2)

URL

string **PublishInvSmartCA** (string Account, string ACpass, string xmlInvData, string username, string password, string pattern = "", string serial = "").

DESCRIPTION

Đây là web service cho phép phát hành hóa đơn với các hệ thống sử dụng SmartCA, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**3.1.25**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml dữ liệu ký hash hóa
*   **pattern**: mẫu số hóa đơn
*   **serial**: ký hiệu hóa đơn
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền phát hành hóa đơn |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải hóa đơn | Không tìm thấy dải hóa đơn hoặc tài khoản phát hành không có quyền phát hành hóa đơn trên dải hóa đơn truyền lên. |
| ERR:6 | Không còn đủ số lượng hóa đơn để phát hành |  |
| ERR:10 | Lô có số hóa đơn vượt quá max cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnhSerial 🡪 serial của hóa đơn điều chỉnhinvNumber: số hóa đơn điều chỉnh |  |

**Cấu trúc chuỗi xmlData truyền lên:**

<Invoices>

<SerialCert>540171AA56FDB2F8476BBD781251C83D</SerialCert>

<Inv>

<key>789</key>

<idInv>10</idInv>

<signValue>J2k7CsSN9Gb6PmsHD9yDJS1/j3s=</signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

tag <key>: fkey

tag <idInv>: id hóa đơn trên hệ thống vnpt

tag <signValue>: chuỗi ký

### In thông báo hóa đơn sai sót

URL

string **PrintNoticeInvError**(string mtdiep,string **username**, string **password**)

DESCRIPTION

Đây là web service in thông báo hóa đơn sai sót

HTTP METHOD

GET

REQUEST BODY

*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   Mtdiep**:** Mã thông điệp

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty đăng nhập |  |
| ERR:2 | Mã thông điệp không tồn tại |  |
| ERR:3 | Data PackageTransactionData rỗng |  |
| ERR:7 | Dữ liệu in thông báo rỗng |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| OK:string | In thông báo hóa đơn sai sót trả về dưới dạng string |  |

### Xóa thông báo phát hành

**URL**

RemovePublishInvoice (string Account, string ACpass, string username, string password, string Pattern, string Serial)

DESCRIPTION

web service xóa thông báo phát hành

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :**  Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **Pattern**: Mẫu số
*   **Serial**: Kí hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| OK | Thành công |  |

## Nhóm các hàm webservice xử lý hóa đơn (BussinessService)

### Điều chỉnh hóa đơn theo số hóa đơn truyền vào

URL

string **AdjustActionAssignedNo**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, string AttachFile, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện điều chỉnh hóa đơn cho phép truyền số hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn điều chỉnh
*   **fkey:**Chuỗi xác định hóa đơn cần điều chỉnh
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Hóa đơn cần điều chỉnh không tồn tại |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Không phát hành được hóa đơn |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được điều chỉnh |  |
| ERR:13 | Lỗi trùng fkey | Fkey của hóa đơn mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:31 | Số hóa đơn truyền vào không hợp lệ |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnhSerial 🡪 serial của hóa đơn điều chỉnhinvNumber: số hóa đơn điều chỉnh |  |

**Cấu trúc của xmlInvData (các trường \* là bắt buộc):**

<DieuChinhHD>

<key>Fkey của hóa đơn để phân biệt hóa đơn xuất cho khách hàng nào \*</key>

<Type>Loại hóa đơn chỉnh sửa(int-mặc định lấy là 2) 2-Điều chỉnh tăng, 3-Điều chỉnh giảm, 4- Hóa đơn điều chỉnh thông tin</Type>

<InvoiceNo>Số hóa đơn \*</InvoiceNo>

<TTChung>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên </Ten>

<MST>Mã số thuế </MST>

<DChi>Địa chỉ </DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Bắt buộc đối với phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (Bắt buộc đối với phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat><!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</DieuChinhHD>

### Html xem trước khi điều chỉnh hóa đơn

URL

string **AdjustInvoiceNoPublish**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện lấy dữ liệu html hóa đơn mới của điều chỉnh hóa đơn trước khi ký số phát hành

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn điều chỉnh
*   **fkey:** Chuỗi xác định hóa đơn cần điều chỉnh
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Hóa đơn cần điều chỉnh không tồn tại |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình tạo mới hóa đơn điều chỉnh |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được điều chỉnh |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn điều chỉnh nhưng chưa phát hành, ký số | Trả về một hóa đơn dưới dạng html |

**Cấu trúc của xmlInvData (các trường \* là bắt buộc):**

<DieuChinhHD>

<key>Fkey cua hoa don \*</key>

<Type>Loại hóa đơn chỉnh sửa(int-mặc định lấy là 2) 2-Điều chỉnh tăng, 3-Điều chỉnh giảm, 4- Hóa đơn điều chỉnh thông tin</Type>

<TTChung>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên \*</Ten>

<MST>Mã số thuế \*</MST>

<DChi>Địa chỉ \*</DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Bắt buộc đối với phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (Bắt buộc đối với phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat> <!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</DieuChinhHD>

### Thay thế hóa đơn theo số hóa đơn truyền vào

URL

string **ReplaceActionAssignedNo**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, string Attachfile, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện thay thế hóa đơn cho phép truyền số hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn thay thế
*   **fkey:** Chuỗi xác định hóa đơn cần thay thế
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình thay thế hóa đơn |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn đã được thay thế rồi. Không thể thay thế nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được thay thế |  |
| ERR:13 | Lỗi trùng fkey | Fkey của hóa đơn mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:31 | Số hóa đơn truyền vào không hợp lệ |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thay thếPatter🡪 Mẫu số của hóa đơn thay thếSerial 🡪 serial của hóa đơn thay thếinvNumber: số hóa đơn thay thế |  |

**Cấu trúc của xmlInvData (các trường \* là bắt buộc):**

<ThayTheHD>

<key>Fkey của hóa đơn \*</key>

<InvoiceNo>Số hóa đơn</InvoiceNo>

<TTChung>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên </Ten>

<MST>Mã số thuế </MST>

<DChi>Địa chỉ </DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Bắt buộc đối với phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (Bắt buộc đối với phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat> <!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</ThayTheHD>

### Html xem trước khi thay thế hóa đơn

URL

string **ReplaceInvoiceNoPublish**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện lấy dữ liệu html hóa đơn mới của thay thế hóa đơn trước khi ký số phát hành

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn thay thế
*   **fkey:** Chuỗi xác định hóa đơn cần thay thế
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình tạo mới hóa đơn thay thế |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn đã được thay thế rồi. Không thể thay thế nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được thay thế |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| chuỗi_hml_trả_về | Trả về chuỗi hml tương ứng với hóa đơn thay thế nhưng chưa phát hành, ký số | Trả về một hóa đơn dưới dạng html |

**Cấu trúc của xmlInvData (các trường \* là bắt buộc):**

<ThayTheHD>

<key>Fkey của hóa đơn cần thay thế \*</key>

<TTChung>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên </Ten>

<MST>Mã số thuế </MST>

<DChi>Địa chỉ </DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số ( phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat><!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</ThayTheHD>

### Thay thế hóa đơn giữ số khác mẫu số

URL

string **ReplaceAssignedNoNewPattern**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, string Attachfile, int? convert, string pattern = null, string serial = null, string OldPattern = null).

DESCRIPTION

Đây là web service thực hiện thay thế hóa đơn giữ số khác mẫu số

HTTP METHOD

POST

REQUEST BODY

*   **username / pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn thay thế
*   **fkey:** Chuỗi xác định hóa đơn cần thay thế
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số mới
*   **Serial**: Ký hiệu
*   **OldPattern:** Mẫu số cũ

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình thay thế hóa đơn |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn đã được thay thế rồi. Không thể thay thế nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được thay thế |  |
| ERR:13 | Lỗi trùng fkey | Fkey của hóa đơn mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:31 | Số hóa đơn truyền vào không hợp lệ |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thay thếPatter🡪 Mẫu số của hóa đơn thay thếSerial 🡪 serial của hóa đơn thay thếinvNumber: số hóa đơn thay thế |  |

**Cấu trúc của xmlInvData (các trường \* là bắt buộc):**

<ThayTheHD>

<key>Fkey của hóa đơn \*</key>

<InvoiceNo>Số hóa đơn \*</InvoiceNo>

<TTChung>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên </Ten>

<MST>Mã số thuế </MST>

<DChi>Địa chỉ </DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Bắt buộc đối với phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (Bắt buộc đối với phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat> <!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</ThayTheHD>

### Thay thế hóa đơn theo fkey, pattern, serial truyền vào

URL

string **ReplaceInvoiceAction**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, string Attachfile, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện thay thế hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn thay thế
*   **fkey:** Chuỗi xác định hóa đơn cần thay thế
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu
*   **AttachFile:** Đường dẫn file biên bản hoặc key để sinh biên bản tự động (=10: sinh biên bản tự động, =11: sinh và ký biên bản tự động, != 10 và !=11: Đường dẫn file biên bản)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình thay thế hóa đơn |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn đã được thay thế rồi. Không thể thay thế nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được thay thế |  |
| ERR:13 | Lỗi trùng fkey | Fkey của hóa đơn mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:21 | Trùng Fkey truyền vào |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thay thếPatter🡪 Mẫu số của hóa đơn thay thếSerial 🡪 serial của hóa đơn thay thếinvNumber: số hóa đơn thay thế |  |

**Cấu trúc của xmlInvData (các trường \* là bắt buộc):**

<ThayTheHD>

<key>Fkey của hóa đơn \*</key>

<TTChung>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên </Ten>

<MST>Mã số thuế </MST>

<DChi>Địa chỉ </DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Bắt buộc đối với phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (Bắt buộc đối với phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat> <!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</ThayTheHD>

### Điều chỉnh hóa đơn theo fkey, pattern, serial truyền vào

URL

string **AdjustInvoiceAction**(string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, string AttachFile, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện điều chỉnh hóa đơn

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn cũ và hóa đơn điều chỉnh
*   **fkey:** Chuỗi xác định hóa đơn cần điều chỉnh
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu
*   **AttachFile:** Đường dẫn file biên bản hoặc key để sinh biên bản tự động (=10: sinh biên bản tự động, =11: sinh và ký biên bản tự động, != 10 và !=11: Đường dẫn file biên bản)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Hóa đơn cần điều chỉnh không tồn tại |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Không phát hành được hóa đơn |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa. |  |
| ERR:9 | Trạng thái hóa đơn không được điều chỉnh |  |
| ERR:13 | Lỗi trùng fkey | Fkey của hóa đơn mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:21 | Trùng Fkey truyền vào |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnhSerial 🡪 serial của hóa đơn điều chỉnhinvNumber: số hóa đơn điều chỉnh |  |

**Cấu trúc của xmlInvData (các trường \* là bắt buộc):**

<DieuChinhHD>

<key>Fkey của hóa đơn để phân biệt hóa đơn xuất cho khách hàng nào \*</key>

<Type>Loại hóa đơn chỉnh sửa(int-mặc định lấy là 2) 2-Điều chỉnh tăng, 3-Điều chỉnh giảm, 4- Hóa đơn điều chỉnh thông tin</Type>

<TTChung>

<MHSo>Mã hồ sơ</MHSo>

<SBKe>Số bảng kê (Số của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</SBKe>

<NBKe>Ngày bảng kê (Ngày của bảng kê các loại hàng hóa, dịch vụ đã bán kèm theo hóa đơn)</NBKe>

<DVTTe>Đơn vị tiền tệ \*</DVTTe>

<TGia>Tỷ giá (Bắt buộc (Trừ trường hợp Đơn vị tiền tệ là VND))</TGia>

<HTTToan>Hình thức thanh toán </HTTToan>

</TTChung>

<NDHDon>

<NBan>

<Ten>Tên </Ten>

<MST>Mã số thuế </MST>

<DChi>Địa chỉ </DChi>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<Fax>Fax</Fax>

<LDDNBo>Lệnh điều động nội bộ (Bắt buộc đối với phiếu xuất kho vận chuyển nội bộ)</LDDNBo>

<HDSo>Hợp đồng số (Hợp đồng vận chuyển) (phiếu xuất kho vận chuyển nội bộ)</HDSo>

<HVTNXHang>Họ và tên người xuất hàng (phiếu xuất kho vận chuyển nội bộ)</HVTNXHang>

<TNVChuyen>Tên người vận chuyển (phiếu xuất kho)</TNVChuyen>

<PTVChuyen>Phương tiện vận chuyển (Bắt buộc đối với phiếu xuất kho)</PTVChuyen>

<HDKTSo>Hợp đồng kinh tế số (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTSo>

<HDKTNgay>Hợp đồng kinh tế ngày (Bắt buộc đối với phiếu xuất kho gửi bán đại lý)</HDKTNgay>

</NBan>

<NMua>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<MKHang>Mã khách hàng</MKHang>

<SDThoai>Số điện thoại</SDThoai>

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

<HVTNMHang>Họ và tên người mua hàng</HVTNMHang>

<STKNHang>Số tài khoản ngân hàng</STKNHang>

<TNHang>Tên ngân hàng</TNHang>

<HVTNNHang>Họ và tên người nhận hàng (phiếu xuất kho)</HVTNNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>Tính chất \* (1-Hàng hóa, dịch vụ; 2-Khuyến mại; 3-Chiết khấu thương mại (trong trường hợp muốn thể hiện thông tin chiết khấu theo dòng); 4-Ghi chú/diễn giải)</TChat>

<STT>Số thứ tự</STT>

<MHHDVu>Mã hàng hóa, dịch vụ (Bắt buộc nếu có)</MHHDVu>

<THHDVu>Tên hàng hóa, dịch vụ \*</THHDVu>

<DVTinh>Đơn vị tính (Bắt buộc nếu có)</DVTinh>

<SLuong>Số lượng (Bắt buộc nếu có)</SLuong>

<DGia>Đơn giá (Bắt buộc nếu có)</DGia>

<TLCKhau>Tỷ lệ % chiết khấu</TLCKhau>

<STCKhau>Số tiền chiết khấu </STCKhau>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT) - Bắt buộc trừ trường hợp TChat = 4</ThTien>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<TThue>Tiền thuế</TThue>

<TSThue>Tiền sau thuế</TSThue>

<TTKhac>

<TTin>

<TTruong>Tên trường</TTruong>

<KDLieu>Kiểu dữ liệu</KDLieu>

<DLieu>Dữ liệu</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat><!--sử dụng hóa đơn GTGT-->

<LTSuat>

<TSuat>Thuế suất (Thuế suất thuế GTGT)</TSuat>

<ThTien>Thành tiền (Thành tiền chưa có thuế GTGT)</ThTien>

<TThue>Tiền thuế (Tiền thuế GTGT)</TThue>

</LTSuat>

</THTTLTSuat>

<TgTCThue>Tổng tiền chưa thuế (Tổng cộng thành tiền chưa có thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTCThue>

<TgTThue>Tổng tiền thuế (Tổng cộng tiền thuế GTGT) (Bắt buộc với hóa đơn GTGT)</TgTThue>

<TTCKTMai>Tổng tiền chiết khấu thương mại</TTCKTMai>

<TgTTTBSo>Tổng tiền thanh toán bằng số \*</TgTTTBSo>

<TgTTTBChu>Tổng tiền thanh toán bằng chữ \*</TgTTTBChu>

</TToan>

</NDHDon>

</DieuChinhHD>

### Điều chỉnh hóa đơn cũ (hóa đơn không tồn tại trên hệ thống)

URL

string **AdjustWithoutInv** (string **account**, string **accPass**, string **invXml**, string **userName**, string **userPass**, string **oldPattern**, string **oldSerial**, decimal **oldNo**, string **strOldArisingDate**, int? **convert**, string **pattern** = null, string **serial** = null, int **relatedInvType** = 3, string **feature** = “”).

DESCRIPTION

Đây là web service thực hiện điều chỉnh hóa đơn cũ (hóa đơn không tồn tại trên hệ thống)

HTTP METHOD

POST

REQUEST BODY

*   **userName / userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **account / accPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **invXml**: String XML dữ liệu hóa đơn điều chỉnh
*   **oldPattern, oldSerial, oldNo:** Các thông số mẫu số, ký hiệu, số hóa đơn của hóa đơn cũ (hóa đơn không tồn tại trên hệ thống).
*   **strOldArisingDate:** Ngày hóa đơn của hóa đơn cũ, định dạng dd/MM/yyyy (Bắt buộc phải nhập đúng và đủ 2 chữ số cho ngày tháng, 4 chữ số cho năm. Ví dụ 01/12/2021)
*   **convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu
*   **relatedInvType:** Loại hóa đơn liên quan, mặc định là 3 (Các loại hóa đơn theo Nghị định số 51/2010/NĐ-CP và Nghị định số 04/2014/NĐ-CP (Trừ hóa đơn điện tử có mã xác thực của cơ quan thuế theo Quyết định số 1209/QĐ-BTC và Quyết định số 2660/QĐ-BTC)))
*   **feature:** trường sẽ dùng trong tương lai, hiện tại không có ý ngĩa, có thể nhập hoặc không

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Hóa đơn cần điều chỉnh không tồn tại |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Không phát hành được hóa đơn hoặc lỗi hệ thống |  |
| ERR:6 | Dải hóa đơn cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:12 | Ngày hóa đơn cũ không hợp lệ |  |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK: 1/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnhSerial 🡪 serial của hóa đơn điều chỉnhinvNumber: số hóa đơn điều chỉnh |  |

**Cấu trúc của xmlInvData (các trường \* là bắt buộc):**

<DieuChinhHD>

<key/>

<Type>2</Type>

<InvoiceNo/>

<TTChung>

<MHSo/>

<SBKe/>

<NBKe/>

<DVTTe>VND</DVTTe>

<TGia>1</TGia>

<HTTToan>TM</HTTToan>

</TTChung>

<NDHDon>

<NBan>

<MST>2222222222-945</MST>

<DChi>địa chỉ người bán</DChi>

<LDDNBo/>

<HDSo/>

<HVTNXHang/>

<TNVChuyen/>

<PTVChuyen/>

<HDKTSo/>

<HDKTNgay/>

</NBan>

<NMua>

<Ten>txt Tên đơn vị mua hàng test bị lỗi</Ten>

<MST>8412221813</MST>

<DChi>Địa chỉ của bên mua lô 2A Làng Quốc Tế Thăng Long, phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội</DChi>

<MKHang>KH1706</MKHang>

<SDThoai>0916996622</SDThoai>

<DCTDTu>thuy3t.hust@gmail.com,thuyexpress@gmail.com</DCTDTu>

<HVTNMHang>txt test Họ tên người mua hàng</HVTNMHang>

<STKNHang>stk0192019201</STKNHang>

<TNHang>Ngân hàng người mua: Ngân hàng TMCP Đông Nam Á</TNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>1</TChat>

<STT>1</STT>

<MHHDVu/>

<THHDVu>sản phẩm 1</THHDVu>

<DVTinh>đơn vị 1</DVTinh>

<SLuong>21</SLuong>

<DGia>21</DGia>

<TLCKhau>0</TLCKhau>

<STCKhau>0</STCKhau>

<TSuat>KHAC:11%</TSuat>

<ThTien>441</ThTien>

<TTKhac>

<TTin>

<TTruong>Amount</TTruong>

<KDLieu>numeric</KDLieu>

<DLieu>489.51</DLieu>

</TTin>

<TTin>

<TTruong>VATAmount</TTruong>

<KDLieu>numeric</KDLieu>

<DLieu>48.51</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat>

<LTSuat>

<TSuat>KHAC:11%</TSuat>

<TThue>49</TThue>

<ThTien>441</ThTien>

</LTSuat>

</THTTLTSuat>

<TgTCThue>441</TgTCThue>

<TgTThue>49</TgTThue>

<TTCKTMai>0</TTCKTMai>

<TgTTTBSo>490</TgTTTBSo>

<TgTTTBChu>Bốn trăm chín mươi đồng</TgTTTBChu>

</TToan>

</NDHDon>

</DieuChinhHD>

### Thay thế hóa đơn cũ (hóa đơn không tồn tại trên hệ thống)

URL

string **ReplaceWithoutInv** (string **account**, string **accPass**, string **invXml**, string **userName**, string **userPass**, string **oldPattern**, string **oldSerial**, decimal **oldNo**, string **strOldArisingDate**, int? **convert**, string **pattern** = null, string **serial** = null, int **relatedInvType** = 3, string **feature** = “”).

DESCRIPTION

Đây là web service thực hiện thay thế hóa đơn cũ (hóa đơn không tồn tại trên hệ thống)

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **account / accPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **invXml**: String XML dữ liệu hóa đơn thay thế
*   **oldPattern, oldSerial, oldNo:** Các thông số mẫu số, ký hiệu, số hóa đơn của hóa đơn cũ (hóa đơn không tồn tại trên hệ thống).
*   **strOldArisingDate:** Ngày hóa đơn của hóa đơn cũ, định dạng dd/MM/yyyy (Bắt buộc phải nhập đúng và đủ 2 chữ số cho ngày tháng, 4 chữ số cho năm. Ví dụ 01/12/2021)
*   **convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode).
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu
*   **relatedInvType:** Loại hóa đơn liên quan, mặc định là 3 (Các loại hóa đơn theo Nghị định số 51/2010/NĐ-CP và Nghị định số 04/2014/NĐ-CP (Trừ hóa đơn điện tử có mã xác thực của cơ quan thuế theo Quyết định số 1209/QĐ-BTC và Quyết định số 2660/QĐ-BTC))
*   **feature:** trường sẽ dùng trong tương lai, hiện tại không có ý ngĩa, có thể nhập hoặc không

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình thay thế hóa đơn |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:12 | Ngày hóa đơn cũ không hợp lệ |  |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số hóa đơn |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK: 1/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thay thếPatter🡪 Mẫu số của hóa đơn thay thếSerial 🡪 serial của hóa đơn thay thếinvNumber: số hóa đơn thay thế |  |

**Cấu trúc của xmlInvData (các trường \* là bắt buộc):**

<ThayTheHD>

<key/>

<InvoiceNo/>

<TTChung>

<MHSo/>

<SBKe/>

<NBKe/>

<DVTTe>VND</DVTTe>

<TGia>1</TGia>

<HTTToan>TM</HTTToan>

</TTChung>

<NDHDon>

<NBan>

<MST>2222222222-945</MST>

<DChi>địa chỉ người bán</DChi>

<LDDNBo/>

<HDSo/>

<HVTNXHang/>

<TNVChuyen/>

<PTVChuyen/>

<HDKTSo/>

<HDKTNgay/>

</NBan>

<NMua>

<Ten>txt Tên đơn vị mua hàng test bị lỗi</Ten>

<MST>8412221813</MST>

<DChi>Địa chỉ của bên mua lô 2A Làng Quốc Tế Thăng Long, phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội</DChi>

<MKHang>KH1706</MKHang>

<SDThoai>0916996622</SDThoai>

<DCTDTu>thuy3t.hust@gmail.com,thuyexpress@gmail.com</DCTDTu>

<HVTNMHang>txt test Họ tên người mua hàng</HVTNMHang>

<STKNHang>stk0192019201</STKNHang>

<TNHang>Ngân hàng người mua: Ngân hàng TMCP Đông Nam Á</TNHang>

</NMua>

<DSHHDVu>

<HHDVu>

<TChat>1</TChat>

<STT>1</STT>

<MHHDVu/>

<THHDVu>sản phẩm 1</THHDVu>

<DVTinh>đơn vị 1</DVTinh>

<SLuong>21</SLuong>

<DGia>21</DGia>

<TLCKhau>0</TLCKhau>

<STCKhau>0</STCKhau>

<TSuat>KHAC:11%</TSuat>

<ThTien>441</ThTien>

<TTKhac>

<TTin>

<TTruong>Amount</TTruong>

<KDLieu>numeric</KDLieu>

<DLieu>489.51</DLieu>

</TTin>

<TTin>

<TTruong>VATAmount</TTruong>

<KDLieu>numeric</KDLieu>

<DLieu>48.51</DLieu>

</TTin>

</TTKhac>

</HHDVu>

</DSHHDVu>

<TToan>

<THTTLTSuat>

<LTSuat>

<TSuat>KHAC:11%</TSuat>

<TThue>49</TThue>

<ThTien>441</ThTien>

</LTSuat>

</THTTLTSuat>

<TgTCThue>441</TgTCThue>

<TgTThue>49</TgTThue>

<TTCKTMai>0</TTCKTMai>

<TgTTTBSo>490</TgTTTBSo>

<TgTTTBChu>Bốn trăm chín mươi đồng</TgTTTBChu>

</TToan>

</NDHDon>

</ThayTheHD>

### Điều chỉnh hóa đơn không phát sinh hóa đơn mới

URL

string **AdjustInvoiceNote** (string **account**, string **accPass**, string **xmlInvData**, string **userName**, string **userPass**, string **fkey**, string **attachFile**, string **pattern**)

DESCRIPTION

Đây là web service thực hiện điều chỉnh thông tin hóa đơn mà không phát sinh hóa đơn mới

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **account / accPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **fkey**: fkey của hóa đơn
*   **xmlInvData**: String XML dữ liệu hóa đơn điều chỉnh
*   **attachFile:** đường dẫn tài liệu đính kèm
*   **pattern**: Mẫu số hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:61 | Fkey hóa đơn bị lỗi có giá trị rỗng hoặc null |  |
| ERR:4 | Không lấy được công ty |  |
| ERR:62 | Không lấy được nội dung điều chỉnh hóa đơn trong xml |  |
| ERR:5 | Lỗi không xác định. Exception, kiểm tra log |  |
| ERR:20 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:25 | Không tạo được invoice service |  |
| ERR:56 | Trạng thái hóa đơn không hợp lệ |  |
| ERR:55 | Pattern truyền vào không giống với pattern hóa đơn cần điều chỉnh |  |
| ERR:20 | Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| OK: pattern;serial;invNumber(Ví dụ:OK: 1/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thay thếPatter🡪 Mẫu số của hóa đơn thay thếSerial 🡪 serial của hóa đơn thay thếinvNumber: số hóa đơn thay thế |  |

**Cấu trúc của xmlInvData (các trường \* là bắt buộc):**

<DieuChinhHD>

<Description>Nội dung điều chỉnh\*</Description>

</DieuChinhHD>

### lấy giá trị Hash cho điều chỉnh thay thế hóa đơn cũ token Smart CA(Bước 1)

Url

string **getHashInvSmartCAToken**(string account, string accPass, string invXml, string userName, string userPass, string oldPattern, string oldSerial, decimal oldNo, string strOldArisingDate, int typeSign, int? convert, string pattern = null, string serial = null, int relatedInvType = 3)

DESCRIPTION

Đây là web service thực hiện điều chỉnh, thay thế hóa đơn cũ (hóa đơn không tồn tại trên hệ thống) sử dụng token.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **invXml**: String XML dữ liệu hóa đơn điều chỉnh, thay thế
*   **oldPattern, oldSerial, oldNo:** Các thông số mẫu số, ký hiệu, số hóa đơn của hóa đơn cũ (hóa đơn không tồn tại trên hệ thống).
*   **strOldArisingDate:** Ngày hóa đơn của hóa đơn cũ, định dạng dd/MM/yyyy (Bắt buộc phải nhập đúng và đủ 2 chữ số cho ngày tháng, 4 chữ số cho năm. Ví dụ 01/12/2021)
*   **convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu
*   **typeSign**: phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4
*   **relatedInvType:** Loại hóa đơn liên quan, mặc định là 3 (Các loại hóa đơn theo Nghị định số 51/2010/NĐ-CP và Nghị định số 04/2014/NĐ-CP (Trừ hóa đơn điện tử có mã xác thực của cơ quan thuế theo Quyết định số 1209/QĐ-BTC và Quyết định số 2660/QĐ-BTC)))

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy công ty |  |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| ERR:5 | Không phát hành được hóa đơn hoặc lỗi hệ thống |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:12 | Ngày hóa đơn cũ không hợp lệ |  |
| ERR:20 | Tham số pattern and serial không hợp lệ |  |
| ERR:21 | Tài khoản không tồn tại |  |
| ERR:22 | Không tìm thấy keystores |  |
| ERR:28 | Chứng thư chưa có trong hệ thống |  |
| ERR:24 | chứng thư không dùng |  |
| ERR:27 | Lỗi chứng thư hết hạn |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| Dữ liệu xml đầu vào không đúng quy định | Chuỗi trả về |  |

*   **chuỗi xml**

<Invoices>

<Inv>

<key>70633DCB-F356-4269-A957-569016AE0017</key>

<idInv>20045793</idInv>

<hashValue>GhdasQwB5B8Y0/lSRHM0K8OXMZo=</hashValue>

<pattern>1/002</pattern>

<serial>C22TWA</serial>

</Inv>

</Invoices>

Trong đó: tag <key>: fkey

tag <idInv>: id hóa đơn trên hệ thống vnpt

tag <hashValue>: chuỗi hash

tag <pattern>: mẫu số

tag <serial>: ký hiệu

### Gửi điều chỉnh, thay thế hóa đơn cũ sử dụng token smart CA (Bước 2)

URL

string **AdjustReplaceWithoutInvSmartCA (**string Account, string ACpass, string xmlInvData, string username, string password,int type, string pattern = "", string serial = ""**)**

DESCRIPTION

Đây là web service cho phép gửi thông tin điều chỉnh, thay thế hóa đơn điện tử cũ ( không tồn tại trong hệ thống) với các hệ thống sử dụng token, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**3.2.11**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **username/password**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml dữ liệu ký hash.
*   **Type:** phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải hóa đơn | Không tìm thấy dải hóa đơn hoặc tài khoản phát hành không có quyền phát hành hóa đơn trên dải hóa đơn truyền lên. |
| ERR:8 | Hóa đơn điều chỉnh hoặc thay thế chưa phát hành hoặc đã điều chỉnh không được thay thế |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế và điều chỉnh |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnh,thay thếSerial 🡪 serial của hóa đơn điều chỉnh,thay thếinvNumber: số hóa đơn điều chỉnh,thay thế |  |

**Cấu trúc chuỗi xmlData truyền lên:**

<Invoices>

<SerialCert>54010101BFD227F36296CA2414AC334E</SerialCert>

<PatternOld>1/003</PatternOld>

<SerialOld>C22TWS</SerialOld>

<NoOlde>00000001</NoOlde>

<Inv>

<key>25904521-A4FB-4A43-BEF8-8455D64A0429</key>

<idInv>20043083</idInv>

<signValue>EKkR0sNI67yHpuvLKWFdVg1jg4Rkm3gSZZAj0m+t/T0O/RGpg2wjItTxBLmZgoUU08szexYTzZQX+x37IExQTtd27XE5D0APA08jjXe/MG+uVRSFoPxf5H9pgwcwlIWVusZhTpLZrTkEhr2fEg+haW9fKuizKI+mur6NlndpJWE=</signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

*   *   *   tag < PatternOld >: Mẫu số của hóa đơn điều chỉnh,thay thế cũ

tag< SerialOld >: hóa đơn điều chỉnh,thay thế cũ

tag< NoOlde> : số hóa đơn cũ

tag <idInv>: id hóa đơn trên hệ thống vnpt

tag <signValue>: chuỗi ký

tag <key>: fkey

### Lấy giá trị Hash cho điều chỉnh thay thế không tồn tại hóa đơn cũ với Smart CA(Bước 1)

Url

string **GetHashWithOutInvSmartCA**(string Account, string ACpass, string xmlInvData, string username, string password, string serialCert, int type, string oldPattern, string oldSerial, decimal oldNo, string strOldArisingDate, int oldInvType, string pattern = "", string serial = "", int convert = 0)

DESCRIPTION

Đây là web service thực hiện điều chỉnh, thay thế hóa đơn cũ (hóa đơn không tồn tại trên hệ thống) sử dụng token.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: String XML dữ liệu hóa đơn điều chỉnh, thay thế
*   **oldPattern, oldSerial, oldNo:** Các thông số mẫu số, ký hiệu, số hóa đơn của hóa đơn cũ (hóa đơn không tồn tại trên hệ thống).
*   **strOldArisingDate:** Ngày hóa đơn của hóa đơn cũ, định dạng dd/MM/yyyy (Bắt buộc phải nhập đúng và đủ 2 chữ số cho ngày tháng, 4 chữ số cho năm. Ví dụ 01/12/2021)
*   **oldInvType**: loại hóa đơn cũ theo quy định (Các loại hóa đơn theo Nghị định số 51/2010/NĐ-CP và Nghị định số 04/2014/NĐ-CP (Trừ hóa đơn điện tử có mã xác thực của cơ quan thuế theo Quyết định số 1209/QĐ-BTC và Quyết định số 2660/QĐ-BTC)
*   **convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu
*   **type**: phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy công ty |  |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| ERR:5 | Không phát hành được hóa đơn hoặc lỗi hệ thống |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:12 | Ngày hóa đơn cũ không hợp lệ |  |
| ERR:20 | Tham số pattern and serial không hợp lệ |  |
| ERR:21 | Tài khoản không tồn tại |  |
| ERR:22 | Không tìm thấy keystores |  |
| ERR:28 | Chứng thư chưa có trong hệ thống |  |
| ERR:24 | chứng thư không dùng |  |
| ERR:27 | Lỗi chứng thư hết hạn |  |
| Dữ liệu xml đầu vào không đúng quy định | Chuỗi trả về |  |

*   **chuỗi xml**

<Invoices>

<Inv>

<key>70633DCB-F356-4269-A957-569016AE0017</key>

<idInv>20045793</idInv>

<hashValue>GhdasQwB5B8Y0/lSRHM0K8OXMZo=</hashValue>

<pattern>1/002</pattern>

<serial>C22TWA</serial>

</Inv>

</Invoices>

Trong đó: tag <key>: fkey

tag <idInv>: id hóa đơn trên hệ thống vnpt

tag <hashValue>: chuỗi hash

tag <pattern>: mẫu số

tag <serial>: ký hiệu

### Gửi điều chỉnh, thay thế không tồn tại hóa đơn cũ với smart CA (Bước 2)

URL

string AdjustReplaceWithOutInvSmartCA **(**string Account, string ACpass, string xmlInvData, string username, string password,int type, string pattern = "", string serial = ""**)**

DESCRIPTION

Đây là web service cho phép gửi thông tin điều chỉnh, thay thế hóa đơn không tồn tại trong hệ thống với các hệ thống sử dụng token, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**3.2.13**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **username/password**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml dữ liệu ký hash.
*   **Type:** phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải hóa đơn | Không tìm thấy dải hóa đơn hoặc tài khoản phát hành không có quyền phát hành hóa đơn trên dải hóa đơn truyền lên. |
| ERR:8 | Hóa đơn điều chỉnh hoặc thay thế chưa phát hành hoặc đã điều chỉnh không được thay thế |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế và điều chỉnh |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnh,thay thếSerial 🡪 serial của hóa đơn điều chỉnh,thay thếinvNumber: số hóa đơn điều chỉnh,thay thế |  |

**Cấu trúc chuỗi xmlData truyền lên:**

<Invoices>

<SerialCert>54010101BFD227F36296CA2414AC334E</SerialCert>

<PatternOld>1/003</PatternOld>

<SerialOld>C22TWS</SerialOld>

<NoOlde>00000001</NoOlde>

<Inv>

<key>25904521-A4FB-4A43-BEF8-8455D64A0429</key>

<idInv>20043083</idInv>

<signValue>EKkR0sNI67yHpuvLKWFdVg1jg4Rkm3gSZZAj0m+t/T0O/RGpg2wjItTxBLmZgoUU08szexYTzZQX+x37IExQTtd27XE5D0APA08jjXe/MG+uVRSFoPxf5H9pgwcwlIWVusZhTpLZrTkEhr2fEg+haW9fKuizKI+mur6NlndpJWE=</signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

*   *   *   tag < PatternOld >: Mẫu số của hóa đơn điều chỉnh,thay thế cũ

tag< SerialOld >: hóa đơn điều chỉnh,thay thế cũ

tag< NoOlde> : số hóa đơn cũ

tag <idInv>: id hóa đơn trên hệ thống vnpt

tag <signValue>: chuỗi ký

tag <key>: fkey

### Lấy giá trị Hash cho điều chỉnh thay thế không tồn tại hóa đơn cũ với Token(Bước 1)

Url

string **GetHashWithOutInvToken**(string Account, string ACpass, string xmlInvData, string username, string password, string serialCert, int type, string oldPattern, string oldSerial, decimal oldNo, string strOldArisingDate, int oldInvType, string pattern = "", string serial = "", int convert = 0)

DESCRIPTION

Đây là web service thực hiện điều chỉnh, thay thế hóa đơn cũ (hóa đơn không tồn tại trên hệ thống) sử dụng token.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: String XML dữ liệu hóa đơn điều chỉnh, thay thế
*   **oldPattern, oldSerial, oldNo:** Các thông số mẫu số, ký hiệu, số hóa đơn của hóa đơn cũ (hóa đơn không tồn tại trên hệ thống).
*   **strOldArisingDate:** Ngày hóa đơn của hóa đơn cũ, định dạng dd/MM/yyyy (Bắt buộc phải nhập đúng và đủ 2 chữ số cho ngày tháng, 4 chữ số cho năm. Ví dụ 01/12/2021)
*   **oldInvType**: loại hóa đơn cũ theo quy định (Các loại hóa đơn theo Nghị định số 51/2010/NĐ-CP và Nghị định số 04/2014/NĐ-CP (Trừ hóa đơn điện tử có mã xác thực của cơ quan thuế theo Quyết định số 1209/QĐ-BTC và Quyết định số 2660/QĐ-BTC)
*   **convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu
*   **type**: phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy công ty |  |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| ERR:5 | Không phát hành được hóa đơn hoặc lỗi hệ thống |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:12 | Ngày hóa đơn cũ không hợp lệ |  |
| ERR:20 | Tham số pattern and serial không hợp lệ |  |
| ERR:21 | Tài khoản không tồn tại |  |
| ERR:22 | Không tìm thấy keystores |  |
| ERR:28 | Chứng thư chưa có trong hệ thống |  |
| ERR:24 | chứng thư không dùng |  |
| ERR:27 | Lỗi chứng thư hết hạn |  |
| Dữ liệu xml đầu vào không đúng quy định | Chuỗi trả về |  |

*   **chuỗi xml**

<Invoices>

<Inv>

<key>70633DCB-F356-4269-A957-569016AE0017</key>

<idInv>20045793</idInv>

<hashValue>GhdasQwB5B8Y0/lSRHM0K8OXMZo=</hashValue>

<pattern>1/002</pattern>

<serial>C22TWA</serial>

</Inv>

</Invoices>

Trong đó: tag <key>: fkey

tag <idInv>: id hóa đơn trên hệ thống vnpt

tag <hashValue>: chuỗi hash

tag <pattern>: mẫu số

tag <serial>: ký hiệu

### Gửi điều chỉnh, thay thế không tồn tại hóa đơn cũ với Token (Bước 2)

URL

string **AdjustReplaceWithOutInvToken (**string Account, string ACpass, string xmlInvData, string username, string password,int type, string pattern = "", string serial = ""**)**

DESCRIPTION

Đây là web service cho phép gửi thông tin điều chỉnh, thay thế hóa đơn không tồn tại trong hệ thống với các hệ thống sử dụng token, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**3.2.15**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **username/password**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml dữ liệu ký hash.
*   **Type:** phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải hóa đơn | Không tìm thấy dải hóa đơn hoặc tài khoản phát hành không có quyền phát hành hóa đơn trên dải hóa đơn truyền lên. |
| ERR:8 | Hóa đơn điều chỉnh hoặc thay thế chưa phát hành hoặc đã điều chỉnh không được thay thế |  |
| ERR:2 | Không tồn tại hóa đơn cần thay thế và điều chỉnh |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnh,thay thếSerial 🡪 serial của hóa đơn điều chỉnh,thay thếinvNumber: số hóa đơn điều chỉnh,thay thế |  |

**Cấu trúc chuỗi xmlData truyền lên:**

<Invoices>

<SerialCert>54010101BFD227F36296CA2414AC334E</SerialCert>

<PatternOld>1/003</PatternOld>

<SerialOld>C22TWS</SerialOld>

<NoOlde>00000001</NoOlde>

<Inv>

<key>25904521-A4FB-4A43-BEF8-8455D64A0429</key>

<idInv>20043083</idInv>

<signValue>EKkR0sNI67yHpuvLKWFdVg1jg4Rkm3gSZZAj0m+t/T0O/RGpg2wjItTxBLmZgoUU08szexYTzZQX+x37IExQTtd27XE5D0APA08jjXe/MG+uVRSFoPxf5H9pgwcwlIWVusZhTpLZrTkEhr2fEg+haW9fKuizKI+mur6NlndpJWE=</signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

*   *   *   tag < PatternOld >: Mẫu số của hóa đơn điều chỉnh,thay thế cũ

tag< SerialOld >: hóa đơn điều chỉnh,thay thế cũ

tag< NoOlde> : số hóa đơn cũ

tag <idInv>: id hóa đơn trên hệ thống vnpt

tag <signValue>: chuỗi ký

tag <key>: fkey

### Thay thế, điều chỉnh hóa đơn sử dụng SmartCa (bước 2)

URL

string **AdjustReplaceInvSmartCA** (string Account, string ACpass, string xmlInvData, string username, string password, int type, string pattern = "", string serial = "")

DESCRIPTION

Đây là web service cho phép thay thế , điều chỉnh hóa đơn cho các khách hàng sử dụng SmartCA, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**3.1.25**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml thông tin hóa đơn ( theo mô tả)
*   **type**: thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4
*   **pattern**: mẫu số hóa đơn
*   **serial**: ký hiệu hóa đơn

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải hóa đơn | Không tìm thấy dải hóa đơn hoặc tài khoản phát hành không có quyền phát hành hóa đơn trên dải hóa đơn truyền lên. |
| ERR:6 | Không còn đủ số lượng hóa đơn để phát hành |  |
| ERR:10 | Lô có số hóa đơn vượt quá max cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới hóa đơn có lỗi |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| ERR:60 | Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành hóa đơn thành côngPatter🡪 Mẫu số của hóa đơn điều chỉnhSerial 🡪 serial của hóa đơn điều chỉnhinvNumber: số hóa đơn điều chỉnh |  |

**Cấu trúc xmlInvData**:

<Invoices>

<SerialCert> **serial chứng thư của công ty** </SerialCert>

<PatternOld> **mẫu số của hóa đơn bị điều chỉnh, thay thế** </PatternOld>

<SerialOld> **ký hiệu của hóa đơn bị điều chỉnh, thay thế** </SerialOld>

<NoOlde> **số hóa đơn của hóa đơn bị điều chỉnh, thay thế** </NoOlde>

<Inv>

<key> **fkey hóa đơn mới** </key>

<idInv> **id hóa đơn mới trên hệ thống vnpt** </idInv>

<signValue> **chuỗi ký** </signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

tag <PatternOld>: mẫu số của hóa đơn bị điều chỉnh, thay thế

tag <SerialOld>: ký hiệu của hóa đơn bị điều chỉnh, thay thế

tag <NoOlde>: số hóa đơn của hóa đơn bị điều chỉnh, thay thế

tag <key>: fkey hóa đơn mới

tag <idInv>: id hóa đơn mới trên hệ thống vnpt

tag <signValue>: giá trị ký số của hóa đơn mới

### Lấy thông tin config

URL

string **getCompanyConfig** (string Account, string ACpass, string configKey)

DESCRIPTION

Đây là web service cho kiểm tra xem đã có config chưa

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành hóa đơn
*   **configKey**: key config

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:7 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:4 | Key null |  |
| ERR:3 | Mã thông điệp không thuộc công ty tra cứu |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| OK: stringBase64 |  |  |

# Danh sách các hàm tích chứng từ khấu trừ thu nhập cá nhân

## Nhóm các hàm webservice tạo lập và phát hàng chứng từ(PublishSerive)

### Phát hành chứng từ (HSM)

Url

String **ImportAndPublishCTT** (string Account, string ACpass, string xmlInvData, string username, string password, string pattern = "", string serial = "", int convert = 0).

DESCRIPTION

Đây là web service cho phép phát hành chứng từ với dữ liệu XML của khách hàng, tối đa cho 5000 chứng từ.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành chứng từ
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice ( tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: Chuỗi XML dữ liệu chứng từ ( theo cấu trúc mô tả)
*   **pattern:** Mẫu số chứng từ
*   **serial:** Ký hiệu chứng từ
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định | Hệ thống sẽ trả về lỗi nếu 1 chứng từ trong chuỗi XML đầu vào không hợp lệ, cả lô chứng từ sẽ không được phát hành. |
| ERR:7 | Thông tin về Username/pass không hợp lệ |  |
| ERR:20 | Pattern và Serial không phù hợp, hoặc không tồn tại chứng từ đã đăng kí có sử dụng Pattern và Serial truyền vào. |  |
| ERR:5 | Không phát hành được chứng từ | Lỗi không xác định, kiểm tra exception trả về (DB roll back) |
| ERR:10 | Lô có số chứng từ vượt quá số lượng cho phép |  |
| ERR:6 | Dải chứng từ không đủ số chứng từ cho lô phát hành |  |
| ERR:13 | Lỗi trùng fkey | 1 hoặc nhiều chứng từ trong lô chứng từ có Fkey trùng với Fkey của chứng từ đã phát hành |
| ERR:21 | Lỗi trùng số chứng từ |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách chứng từ tồn tại ngày chứng từ nhỏ hơn ngày chứng từ đã phát hành |  |
| OK:pattern;serial1-key1_num1,key2_num12, …)(Ví dụ:OK:CTT56/001;AA/2022-key1_1,key2_2,key3_3,key4_4,key5_5) | OK 🡪 đã phát hành chứng từ thành côngPattern 🡪 Mẫu số của các chứng từ đã phát hànhSerial1 🡪 serial của dãy các chứng từ phát hànhnum1, num2… là các số chứng từkey1,key2… là khóa để nhận biết chứng từ phát hành cho khách hàng nào(lấy từ đầu vào) | Các chứng từ có serial khác nhau phân cách bởi dấu “;”Các số chứng từ phân cách bởi “,” |

**Định dạng chuỗi xml đầu vào (các trường \* là bắt buộc):**

<DSCTu>

< CTu>

<key>Fkey cua chug tu</key>

<DLCTu>

<TTChung>

<NLap>ngày lập chứng từ </NLap>

</TTChung>

<NDCTu>

<NNT>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<QTich>Quốc tịch(VN)</QTich>

<CNCTru>Mã cá nhân cư trú</CNCTru>

< CMND >chứng minh thư hoặc căn cước công dân</ CMND >

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

< SDThoai >số điện thoại </ SDThoai >

< NCCMND >ngày cấp cmnd hoặc cccd</ NCCMND >

</NNT>

<TTNCNKTru>

<KTNhap>Khoản thu nhập</KTNhap>

<TThang>Thời điểm trả thu nhập(từ tháng)</ TThang>

<DThang>Thời điểm trả thu nhập(Đến tháng)</ DThang>

<Nam> Thời điểm trả thu nhập(năm)</ Nam>

< TTNCThue>  Tổng thu nhập chưa tính thuế</ TTNCThue >

< TTNTThue>tổng thu nhập tính thuế</ TTNTThue >

< SThue>Tổng thu nhập tính thuế\*</ SThue >

<BHiem>Bảo hiểm</BHiem>

</TTNCNKTru>

</ NDCTu>

</DLCTu>

</CTu>

</DSCTu>

### Lấy giá trị Hash cho phát hành chứng từ sử dụng token(bước 1)

string **getHashCTTWithToken** (string Account, string ACpass, string xmlInvData, string username, string password, string serialCert, int type, string invToken, string pattern = "", string serial = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép phát hành chứng từ với các hệ thống sử dụng token, thực hiện truyền dữ liệu chứng từ và lấy giá trị hash value để ký số bằng token ở client.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành chứng từ
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml chứng từ (theo mẫu mô tả kèm theo)
*   **serialCert**: Serial của chứng thư số công ty đã đăng ký trong hệ thống
*   **type**: phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4
*   **invToken**: chuỗi token chứng từ = mẫu số;ký hiệu;số chứng từ (ví dụ: CTT56/001;AA/2022;1) – chỉ cần khi thay thế/ điều chỉnh; phát hành thì để trống
*   **pattern**: mẫu số chứng từ
*   **serial**: ký hiệu chứng từ

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Dải chứng từ hết, User/Account không có quyền với Serial/Pattern và Serial không phù hợp |  |
| ERR:6 | Không còn đủ số lượng chứng từ để phát hành |  |
| ERR:10 | Lô có số chứng từ vượt quá số lượng tối đa cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới chứng từ có lỗi |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| Chuỗi xml trả về | Chuỗi trả về |  |

Cấu trúc chuỗi XML trả về:

<Invoices>

<Inv>

<key>**123**</key>

<idInv>**128668**</idInv>

<hashValue>**rKdYgeYc7CYLOhjfNFDZ8nBaWjA=**</hashValue>

<pattern>**CTT56/001**</pattern>

<serial>**AA/2022**</serial>

</Inv>

<Inv>

<key>**456**</key>

<idInv>**128923**</idInv>

<hashValue>**2p60p82YQhqjMHG9t/toIaLfENQ=**</hashValue>

<pattern>**CTT56/001**</pattern>

<serial>**AA/2022**</serial>

</Inv>

</Invoices>

Trong đó: tag <key>: fkey

tag <idInv>: id chứng từ trên hệ thống vnpt

tag <hashValue>: chuỗi hash

tag <pattern>: mẫu số

tag <serial>: ký hiệu

### Gửi phát hành chứng từ sử dụng token(bước 2)

URL

string **publishCTTWithToken** (string Account, string ACpass, string xmlInvData, string username, string password, string pattern = "", string serial = "").

DESCRIPTION

Đây là web service cho phép phát hành chứng từ với các hệ thống sử dụng token, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**4.1.2**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành chứng từ
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml dữ liệu ký hash hóa
*   **pattern**: mẫu số chứng từ
*   **serial**: ký hiệu chứng từ
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền phát hành chứng từ |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải chứng từ | Không tìm thấy dải chứng từ hoặc tài khoản phát hành không có quyền phát hành chứng từ trên dải chứng từ truyền lên. |
| ERR:6 | Không còn đủ số lượng chứng từ để phát hành |  |
| ERR:10 | Lô có số chứng từ vượt quá max cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới chứng từ có lỗi |  |
| OK: pattern;serial;invNumber(Ví dụ:OK: CTT56/001;AA/2022;0000002) | OK 🡪 đã phát hành chứng từ thành côngPatter🡪 Mẫu số của chứng từ điều chỉnhSerial 🡪 serial của chứng từ điều chỉnhinvNumber: số chứng từ điều chỉnh |  |

**Cấu trúc chuỗi xmlData truyền lên:**

<Invoices>

<SerialCert>540171AA56FDB2F8476BBD781251C83D</SerialCert>

<Inv>

<key>789</key>

<idInv>10</idInv>

<signValue>J2k7CsSN9Gb6PmsHD9yDJS1/j3s=</signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

tag <key>: fkey

tag <idInv>: id chứng từ trên hệ thống vnpt

tag <signValue>: chuỗi ký

### Lấy giá trị Hash cho phát hành chứng từ sử dụng smartCA(bước 1)

URL

string **GetHashCTTSmartCA** (string Account, string ACpass, string xmlInvData, string username, string password, string serialCert, int type, string invToken, string pattern = "", string serial = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép phát hành chứng từ với các hệ thống sử dụng smartCA, thực hiện truyền dữ liệu chứng từ và lấy giá trị hash value để ký số bằng smartCA ở client.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành chứng từ
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml chứng từ (theo mẫu mô tả kèm theo)
*   **serialCert**: Serial của chứng thư số công ty đã đăng ký trong hệ thống
*   **type**: phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4
*   **invToken**: chuỗi token chứng từ = mẫu số;ký hiệu;số chứng từ (ví dụ: CTT56/001;AA/2022;1) – chỉ cần khi thay thế/ điều chỉnh; phát hành thì để trống
*   **pattern**: mẫu số chứng từ
*   **serial**: ký hiệu chứng từ

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Dải chứng từ hết, User/Account không có quyền với Serial/Pattern và Serial không phù hợp |  |
| ERR:6 | Không còn đủ số lượng chứng từ để phát hành |  |
| ERR:10 | Lô có số chứng từ vượt quá số lượng tối đa cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới chứng từ có lỗi |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| Chuỗi xml trả về | Chuỗi trả về |  |

Cấu trúc chuỗi XML trả về:

<Invoices>

<Inv>

<key>**123**</key>

<idInv>**128668**</idInv>

<hashValue>**rKdYgeYc7CYLOhjfNFDZ8nBaWjA=**</hashValue>

<pattern>**CTT56/001**</pattern>

<serial>**AA/2022**</serial>

</Inv>

<Inv>

<key>**456**</key>

<idInv>**128923**</idInv>

<hashValue>**2p60p82YQhqjMHG9t/toIaLfENQ=**</hashValue>

<pattern>**CTT56/001**</pattern>

<serial>**AA/2022**</serial>

</Inv>

</Invoices>

Trong đó: tag <key>: fkey

tag <idInv>: id chứng từ trên hệ thống vnpt

tag <hashValue>: chuỗi hash

tag <pattern>: mẫu số

tag <serial>: ký hiệu

### Gửi phát hành chứng từ sử dụng smartCA(bước 2)

URL

string **PublishCTTSmartCA** (string Account, string ACpass, string xmlInvData, string username, string password, string pattern = "", string serial = "").

DESCRIPTION

Đây là web service cho phép phát hành chứng từ với các hệ thống sử dụng SmartCA, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**4.1.4**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành chứng từ
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml dữ liệu ký hash hóa
*   **pattern**: mẫu số chứng từ
*   **serial**: ký hiệu chứng từ
*   **convert:** Mặc định là 0 (0 – Không cần convert từ TCVN3 sang Unicode / 1- Cần convert từ TCVN3 sang Unicode)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền phát hành chứng từ |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải chứng từ | Không tìm thấy dải chứng từ hoặc tài khoản phát hành không có quyền phát hành chứng từ trên dải chứng từ truyền lên. |
| ERR:6 | Không còn đủ số lượng chứng từ để phát hành |  |
| ERR:10 | Lô có số chứng từ vượt quá max cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới chứng từ có lỗi |  |
| OK: pattern;serial;invNumber(Ví dụ:OK: CTT56/001;AA/2022;0000002) | OK 🡪 đã phát hành chứng từ thành côngPatter🡪 Mẫu số của chứng từ điều chỉnhSerial 🡪 serial của chứng từ điều chỉnhinvNumber: số chứng từ điều chỉnh |  |

**Cấu trúc chuỗi xmlData truyền lên:**

<Invoices>

<SerialCert>540171AA56FDB2F8476BBD781251C83D</SerialCert>

<Inv>

<key>789</key>

<idInv>10</idInv>

<signValue>J2k7CsSN9Gb6PmsHD9yDJS1/j3s=</signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

tag <key>: fkey

tag <idInv>: id chứng từ trên hệ thống vnpt

tag <signValue>: chuỗi ký

## Nhóm các hàm webserive phát hành thay thế chứng từ(BusinessService)

### Thay thế chứng từ (HSM)

URL

string **ReplaceCTTAction** (string Account, string ACpass, string xmlInvData, string username, string pass, string fkey, string Attachfile, int? convert, string pattern = null, string serial = null).

DESCRIPTION

Đây là web service thực hiện thay thế chứng từ

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành chứng từ
*   **xmlInvData**: String XML dữ liệu chứng từ cũ và chứng từ thay thế
*   **fkey:** Chuỗi xác định chứng từ cần thay thế
*   **Convert**: Mặc định là 0, (0 – Không cần convert từ TCVN3 sang Unicode. 1- Cần convert từ TCVN3 sang Unicode)
*   **Pattern**: Mẫu số
*   **Serial**: Ký hiệu
*   **AttachFile:** Đường dẫn file biên bản hoặc key để sinh biên bản tự động (=10: sinh biên bản tự động, =11: sinh và ký biên bản tự động, != 10 và !=11: Đường dẫn file biên bản)

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tồn tại chứng từ cần thay thế |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:5 | Có lỗi trong quá trình thay thế chứng từ |  |
| ERR:6 | Dải chứng từ cũ đã hết |  |
| ERR:7 | User name không phù hợp, không tìm thấy company tương ứng cho user. |  |
| ERR:8 | Chứng từ đã được thay thế rồi. Không thể thay thế nữa. |  |
| ERR:9 | Trạng thái chứng từ không được thay thế |  |
| ERR:13 | Lỗi trùng fkey | Fkey của chứng từ mới đã tồn tại trên hệ thống |
| ERR:14 | Lỗi trong quá trình thực hiện cấp số chứng từ |  |
| ERR:15 | Lỗi khi thực hiện Deserialize chuỗi chứng từ đầu vào |  |
| ERR:19 | Pattern truyền vào không giống với chứng từ cần điều chỉnh |  |
| ERR:20 | Dải chứng từ hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| ERR:21 | Trùng Fkey truyền vào |  |
| ERR:29 | Lỗi chứng thư hết hạn |  |
| ERR:30 | Danh sách chứng từ tồn tại ngày chứng từ nhỏ hơn ngày chứng từ đã phát hành |  |
| ERR:60 | Chỉ được phép điều chỉnh chứng từ cùng loại (Có mã / Không mã). |  |
| ERR:61 | Chỉ được phép điều chỉnh chứng từ cùng loại (HD GTGT / HD bán hàng...). |  |
| ERR:62 | Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các chứng từ không mã gửi thông tin chi tiết. |  |
| OK: pattern;serial;invNumber(Ví dụ:OK: CTT56/001;AA/2022;0000002) | OK 🡪 đã phát hành chứng từ thay thếPatter🡪 Mẫu số của chứng từ thay thếSerial 🡪 serial của chứng từ thay thếinvNumber: số chứng từ thay thế |  |

**Cấu trúc của xmlInvData trường hợp không có trường mở rộng (các trường \* là bắt buộc):**

<ThayTheCT>

<key>**fkey chứng từ** </key>

<TTChung>

<NLap>ngày lập chứng từ </NLap>

</TTChung>

<NDCTu>

<NNT>

<Ten>Tên \*</Ten>

<MST>Mã số thuế (Bắt buộc nếu có)</MST>

<DChi>Địa chỉ \*</DChi>

<QTich>Quốc tịch(VN)</QTich>

<CNCTru>Mã cá nhân cư trú</CNCTru>

< CMND >chứng minh thư hoặc căn cước công dân</ CMND >

<DCTDTu>Địa chỉ thư điện tử </DCTDTu>

< SDThoai >số điện thoại </ SDThoai >

< NCCMND >ngày cấp cmnd hoặc cccd</ NCCMND >

</NNT>

<TTNCNKTru>

<KTNhap>Khoản thu nhập</KTNhap>

<TThang>Thời điểm trả thu nhập(tháng)</ TThang>

<DThang>Thời điểm trả thu nhập(tháng)</DThang>

<Nam> Thời điểm trả thu nhập(năm)</ Nam>

< TTNCThue>  Tổng thu nhập chưa tính thuế</ TTNCThue >

< TTNTThue>tổng thu nhập tính thuế</ TTNTThue >

< SThue>Tổng thu nhập tính thuế\*</ SThue >

<Bhiem>Khoản đóng bảo hiểm bắt buộc</Bhiem>

</TTNCNKTru>

</ NDCTu>

</ThayTheCT>

### Lấy giá trị Hash thay thế chứng từ sử dụng token(buoc 1)

URL

string **getHashCTTTokenReplace** (string Account, string ACpass, string xmlInvData, string username, string password, string serialCert, int type, string invToken, string pattern = "", string serial = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép phát hành chứng từ với các hệ thống sử dụng token, thực hiện truyền dữ liệu chứng từ và lấy giá trị hash value để ký số bằng token ở client.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành chứng từ
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml chứng từ (theo mẫu mô tả kèm theo)
*   **serialCert**: Serial của chứng thư số công ty đã đăng ký trong hệ thống
*   **type**: phát hành mới: 0, thay thế = 1
*   **invToken**: chuỗi token chứng từ = mẫu số;ký hiệu;số chứng từ (ví dụ: CTT56/001;AA/2022;1) – chỉ cần khi thay thế/ điều chỉnh; phát hành thì để trống
*   **pattern**: mẫu số chứng từ
*   **serial**: ký hiệu chứng từ

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Dải chứng từ hết, User/Account không có quyền với Serial/Pattern và Serial không phù hợp |  |
| ERR:6 | Không còn đủ số lượng chứng từ để phát hành |  |
| ERR:10 | Lô có số chứng từ vượt quá số lượng tối đa cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới chứng từ có lỗi |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| Chuỗi xml trả về | Chuỗi trả về |  |

Cấu trúc chuỗi XML trả về:

<Invoices>

<Inv>

<key>**123**</key>

<idInv>**128668**</idInv>

<hashValue>**rKdYgeYc7CYLOhjfNFDZ8nBaWjA=**</hashValue>

<pattern>**CTT56/001**</pattern>

<serial>**AA/2022**</serial>

</Inv>

<Inv>

<key>**456**</key>

<idInv>**128923**</idInv>

<hashValue>**2p60p82YQhqjMHG9t/toIaLfENQ=**</hashValue>

<pattern>**CTT56/001**</pattern>

<serial>**AA/2022**</serial>

</Inv>

</Invoices>

Trong đó: tag <key>: fkey

tag <idInv>: id chứng từ trên hệ thống vnpt

tag <hashValue>: chuỗi hash

tag <pattern>: mẫu số

tag <serial>: ký hiệu

### Gửi thay thế chứng từ sử dụng token(bước 2)

string **AdjustReplaceCTTToken** (string Account, string ACpass, string xmlInvData, string username, string password, int type, string pattern = "", string serial = "")

DESCRIPTION

Đây là web service cho phép gửi thông tin thay thế chứng từ với các hệ thống sử dụng token, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**4.2.2**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **username/password**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml dữ liệu ký hash.
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu
*   **type :** thay thế = 1

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải chứng từ | Không tìm thấy dải chứng từ hoặc tài khoản phát hành không có quyền phát hành chứng từ trên dải chứng từ truyền lên. |
| ERR:8 | Chứng từ điều chỉnh hoặc thay thế chưa phát hành hoặc đã điều chỉnh không được thay thế |  |
| ERR:2 | Không tồn tại chứng từ cần thay thế và điều chỉnh |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới chứng từ có lỗi |  |
| OK: pattern;serial;invNumber(Ví dụ:OK:01GTKT3/001;AA/12E;0000002) | OK 🡪 đã phát hành chứng từ thành côngPatter🡪 Mẫu số của chứng từ điều chỉnh,thay thếSerial 🡪 serial của chứng từ điều chỉnh,thay thếinvNumber: số chứng từ điều chỉnh,thay thế |  |

**Cấu trúc chuỗi xmlData truyền lên:**

<Invoices>

<SerialCert>54010101BFD227F36296CA2414AC334E</SerialCert>

<PatternOld>**CTT56**/003</PatternOld>

<SerialOld>AA/2022</SerialOld>

<NoOlde>00000001</NoOlde>

<Inv>

<key>25904521-A4FB-4A43-BEF8-8455D64A0429</key>

<idInv>20043083</idInv>

<signValue>EKkR0sNI67yHpuvLKWFdVg1jg4Rkm3gSZZAj0m+t/T0O/RGpg2wjItTxBLmZgoUU08szexYTzZQX+x37IExQTtd27XE5D0APA08jjXe/MG+uVRSFoPxf5H9pgwcwlIWVusZhTpLZrTkEhr2fEg+haW9fKuizKI+mur6NlndpJWE=</signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

*   *   *   tag < PatternOld >: Mẫu số của chứng từ điều chỉnh,thay thế cũ

tag< SerialOld >: chứng từ điều chỉnh,thay thế cũ

tag< NoOlde> : số chứng từ cũ

tag <idInv>: id chứng từ trên hệ thống vnpt

tag <signValue>: chuỗi ký

tag <key>: fkey

### Lấy giá trị Hash thay thế chứng từ sử dụng smartCA(bước 1)

URL

string **GetHashCTTSmartCAReplace** (string Account, string ACpass, string xmlInvData, string username, string password, string serialCert, int type, string invToken, string pattern = "", string serial = "", int convert = 0)

DESCRIPTION

Đây là web service cho phép phát hành chứng từ với các hệ thống sử dụng smartCA, thực hiện truyền dữ liệu chứng từ và lấy giá trị hash value để ký số bằng smartCA ở client.

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành chứng từ
*   **Username/pass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml chứng từ (theo mẫu mô tả kèm theo)
*   **serialCert**: Serial của chứng thư số công ty đã đăng ký trong hệ thống
*   **type**: phát hành mới: 0, thay thế = 1,
*   **invToken**: chuỗi token chứng từ = mẫu số;ký hiệu;số chứng từ (ví dụ: CTT56/001;AA/2022;1) – chỉ cần khi thay thế/ điều chỉnh; phát hành thì để trống
*   **pattern**: mẫu số chứng từ
*   **serial**: ký hiệu chứng từ

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Dải chứng từ hết, User/Account không có quyền với Serial/Pattern và Serial không phù hợp |  |
| ERR:6 | Không còn đủ số lượng chứng từ để phát hành |  |
| ERR:10 | Lô có số chứng từ vượt quá số lượng tối đa cho phép |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới chứng từ có lỗi |  |
| ERR:35 | Công ty đăng ký DK01 cả có mã, không mã. Tạo cả ký hiệu cả 2 dải có mã và không mã sẽ yêu cầu bắt buộc truyền pattern, serial |  |
| Chuỗi xml trả về | Chuỗi trả về |  |

Cấu trúc chuỗi XML trả về:

<Invoices>

<Inv>

<key>**123**</key>

<idInv>**128668**</idInv>

<hashValue>**rKdYgeYc7CYLOhjfNFDZ8nBaWjA=**</hashValue>

<pattern>**CTT56/001**</pattern>

<serial>**AA/2022**</serial>

</Inv>

<Inv>

<key>**456**</key>

<idInv>**128923**</idInv>

<hashValue>**2p60p82YQhqjMHG9t/toIaLfENQ=**</hashValue>

<pattern>**CTT56/001**</pattern>

<serial>**AA/2022**</serial>

</Inv>

</Invoices>

Trong đó: tag <key>: fkey

tag <idInv>: id chứng từ trên hệ thống vnpt

tag <hashValue>: chuỗi hash

tag <pattern>: mẫu số

tag <serial>: ký hiệu

### Gửi thay thế chứng từ sử dụng smartCA(bước 2)

**url**

string **AdjustReplaceCTTSmartCA (**string Account, string ACpass, string xmlInvData, string username, string password,int type, string pattern = "", string serial = ""**)**

DESCRIPTION

Đây là web service cho phép gửi thông tin thay thế chứng từ với các hệ thống sử dụng token, sau khi thực hiện gọi hàm Lấy giá trị Hash ở bước 1 (**4.2.4**)

HTTP METHOD

POST

REQUEST BODY

*   **Account/ACPass:** Tài khoản được cấp phát cho nhân viên gọi lệnh gửi thông điệp.
*   **username/password**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **xmlInvData**: chuỗi xml dữ liệu ký hash.
*   **pattern**: Mẫu số
*   **serial**: Ký hiệu
*   **type = 1 mặc định thay thế**

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:21 | Không tìm thấy công ty hoặc tài khoản không tồn tại |  |
| ERR:22 | Công ty chưa đăng ký chứng thư số |  |
| ERR:28 | Chưa có thông tin chứng thư trong hệ thống |  |
| ERR:24 | Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống |  |
| ERR:27 | Chứng thư chưa đến thời điểm sử dụng |  |
| ERR:26 | Chứng thư số hết hạn |  |
| ERR:3 | Dữ liệu xml đầu vào không đúng quy định |  |
| ERR:20 | Không tìm thấy dải chứng từ | Không tìm thấy dải chứng từ hoặc tài khoản phát hành không có quyền phát hành chứng từ trên dải chứng từ truyền lên. |
| ERR:8 | Chứng từ điều chỉnh hoặc thay thế chưa phát hành hoặc đã điều chỉnh không được thay thế |  |
| ERR:2 | Không tồn tại chứng từ cần thay thế và điều chỉnh |  |
| ERR:5 | Có lỗi xảy ra | Lỗi không xác định |
| ERR:30 | Tạo mới chứng từ có lỗi |  |
| OK: pattern;serial;invNumber(Ví dụ:OK: CTT56/001;AA/2022;0000002) | OK 🡪 đã phát hành chứng từ thành côngPatter🡪 Mẫu số của chứng từ điều chỉnh,thay thếSerial 🡪 serial của chứng từ điều chỉnh,thay thếinvNumber: số chứng từ điều chỉnh,thay thế |  |

**Cấu trúc chuỗi xmlData truyền lên:**

<Invoices>

<SerialCert>54010101BFD227F36296CA2414AC334E</SerialCert>

<PatternOld>CTT56/003</PatternOld>

<SerialOld>AA/2022</SerialOld>

<NoOlde>00000001</NoOlde>

<Inv>

<key>25904521-A4FB-4A43-BEF8-8455D64A0429</key>

<idInv>20043083</idInv>

<signValue>EKkR0sNI67yHpuvLKWFdVg1jg4Rkm3gSZZAj0m+t/T0O/RGpg2wjItTxBLmZgoUU08szexYTzZQX+x37IExQTtd27XE5D0APA08jjXe/MG+uVRSFoPxf5H9pgwcwlIWVusZhTpLZrTkEhr2fEg+haW9fKuizKI+mur6NlndpJWE=</signValue>

</Inv>

</Invoices>

Trong đó: tag <SerialCert>: serial chứng thư của công ty

*   *   *   tag < PatternOld >: Mẫu số của chứng từ điều chỉnh,thay thế cũ

tag< SerialOld >: chứng từ điều chỉnh,thay thế cũ

tag< NoOlde> : số chứng từ cũ

## Hủy chứng từ

URL

string **cancelInvCTT**(string Account, string ACpass, string Fkey, string functionName, string userName, string userPass,string note = null)

DESCRIPTION

Đây là web service thực hiện hủy chứng từ theo giá trị fkey truyền vào

HTTP METHOD

POST

REQUEST BODY

*   **userName /** **userPass**: Tài khoản được cấp phát cho khách hàng để gọi đến webservice (tài khoản có quyền ServiceRole trong hệ thống).
*   **Account/ACPass :** Tài khoản được cấp phát cho nhân viên gọi lệnh phát hành chứng từ
*   **fkey:**Chuỗi xác định chứng từ cần hủy
*   **functionName: CancelInv hủy không ký biên bản ,** cancelInvSignFile: hủy tạo file biên bản
*   **Note : ghi chú biên bản**

RETURNS

| Kết quả | Mô tả | Ghi chú |
| --- | --- | --- |
| ERR:1 | Tài khoản đăng nhập sai hoặc không có quyền |  |
| ERR:2 | Không tìm thấy chứng từ |  |
| ERR:6 | Lỗi không xác định |  |
| ERR:7 | Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định |  |
| ERR:8 | Chứng từ đã bị điều chỉnh / hủy / chứng từ mới tạo không thể hủy được |  |
| ERR:9 | Chứng từ đã thanh toán, không cho phép hủy |  |
| ERR:20 | Dải chứng từ hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp |  |
| OK: | Hủy chứng từ thành công |  |