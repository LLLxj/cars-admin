<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="150px">
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="dataForm.productName" placeholder="请输入产品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="贷款成数" prop="percent">
        <el-input v-model="dataForm.percent" placeholder="请输入贷款成数" clearable></el-input>
      </el-form-item>
      <el-form-item label="贷款利率" prop="interestRate">
        <el-input v-model="dataForm.interestRate" placeholder="请输入贷款利率" clearable></el-input>
      </el-form-item>
      <el-form-item label="信用等级" prop="creditRating">
        <el-input v-model="dataForm.creditRating" placeholder="请输入信用等级" clearable></el-input>
      </el-form-item>
      <el-form-item label="年龄要求" prop="age">
        <el-input v-model="dataForm.age" placeholder="请输入年龄要求" clearable></el-input>
      </el-form-item>
      <el-form-item label="执行中能否操作" prop="isExecute">
        <el-radio-group v-model="dataForm.isExecute">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="司法风险" prop="judicialRisk">
        <el-select v-model="dataForm.judicialRisk" class="box-input" placeholder="请选择司法风险">
          <el-option v-for="item in judicialRiskList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="多头借贷风险" prop="mickleRisk">
        <el-select v-model="dataForm.mickleRisk" class="box-input" placeholder="请选择多头借贷风险">
          <el-option v-for="item in moreBorrowList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否可做事故车" prop="isAccidentCar">
        <el-radio-group v-model="dataForm.isAccidentCar">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="车龄要求" prop="carAge">
        <el-input v-model="dataForm.carAge" placeholder="请输入车龄要求" clearable></el-input>
      </el-form-item>
      <el-form-item label="已过科目几" prop="subject">
        <el-select v-model="dataForm.subject" class="box-input" placeholder="请选择已过科目">
          <el-option v-for="item in subjectList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="免担保年龄要求" prop="ageNoGuarantee">
        <el-input v-model="dataForm.ageNoGuarantee" placeholder="请输入免担保年龄要求" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否有驾驶证" prop="isDriverCard">
        <el-radio-group v-model="dataForm.isDriverCard">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名下有按揭车辆台数" prop="mortgageCarNum">
        <el-input v-model="dataForm.mortgageCarNum" placeholder="请输入名下有按揭车辆台数" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否蓝牌货车可做" prop="isBlueCard">
        <el-radio-group v-model="dataForm.isBlueCard">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="银行机构借款申请次数" prop="loanBankNum">
        <el-input v-model="dataForm.loanBankNum" placeholder="请输入银行机构借款申请次数" clearable></el-input>
      </el-form-item>
      <el-form-item label="非银行机构借款申请次数" prop="loanUnBankNum">
        <el-input v-model="dataForm.loanUnBankNum" placeholder="请输入非银行机构借款申请次数" clearable></el-input>
      </el-form-item>
      <el-form-item label="可承担风险记录" prop="recordIdList">
        <!-- <el-select
          v-model="dataForm.recordIdList"
          filterable
          :multiple="true"
          :clearable="true"
          placeholder="请选择"
        >
          <el-option
            v-for="item in recordList"
            :key="item.recordId"
            :label="item.recordName"
            :value="item.recordId"
          />
        </el-select> -->
        <el-checkbox-group v-model="dataForm.recordIdList">
          <el-checkbox v-for="item in recordList" :key="item.recordId" :label="item.recordId">{{ item.recordName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Business from '@/api/product/business'
  import BusinessSelect from '@/views/common-select/all-business-select'
  import Customer from '@/api/customer/customer'
  import Record from '@/api/product/record'
  import Product from '@/api/product/product'
  export default {
    data () {
      var removeSpace = (rule, value, callback) => {
        this.dataForm.userName = removeBlank(value)
        callback()
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        judicialRiskList: [
          { label: '无风险', value: 0 },
          { label: '低风险', value: 1 },
          { label: '中风险', value: 2 },
          { label: '高风险', value: 3 }
        ],
        moreBorrowList: [
          { label: '无风险', value: 0 },
          { label: '低风险', value: 1 },
          { label: '中风险', value: 2 },
          { label: '高风险', value: 3 }
        ],
        subjectList: [
          { label: '科目一', value: 0 },
          { label: '科目二', value: 1 },
          { label: '科目三', value: 2 },
          { label: '科目四', value: 3 }
        ],
        recordList: [],
        dataForm: {
          productName: '',
          percent: '',
          interestRate: '',
          creditRating: '',
          age: '',
          isExecute: null,
          judicialRisk: '',
          mickleRisk: '',
          isAccidentCar: '',
          carAge: '',
          subject: '',
          ageNoGuarantee: '',
          isDriverCard: '',
          mortgageCarNum: '',
          isBlueCard: '',
          loanBankNum: '',
          loanUnBankNum: '',
          recordIdList: []
        },
        id: '',
        rules: {
          productName: [
            { required: true, message: '请输入产品名称', trigger: 'blur' }
          ],
          percent: [
            { required: true, message: '请输入贷款成数', trigger: 'blur' }
          ],
          interestRate: [
            { required: true, message: '请输入贷款利率', trigger: 'blur' }
          ],
          creditRating: [
            { required: true, message: '请输入信用等级', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '请输入年龄要求', trigger: 'blur' }
          ],
          isExecute: [
            { required: true, message: '请选择', trigger: 'blur' }
          ],
          judicialRisk: [
            { required: true, message: '请选择司法风险', trigger: 'blur' }
          ],
          moreBorrow: [
            { required: true, message: '请选择多头借贷风险', trigger: 'blur' }
          ],
          isAccidentCar: [
            { required: true, message: '请选择是否可做事故车', trigger: 'blur' }
          ],
          carAge: [
            { required: true, message: '请输入车龄要求', trigger: 'blur' }
          ],
          subject: [
            { required: true, message: '请选择已过科目', trigger: 'blur' }
          ],
          ageNoGuarantee: [
            { required: true, message: '请输入免担保年龄要求', trigger: 'blur' }
          ],
          isDriverCard: [
            { required: true, message: '请选择是否有驾驶证', trigger: 'blur' }
          ],
          mortgageCarNum: [
            { required: true, message: '请输入名下有按揭车辆台数', trigger: 'blur' }
          ],
          isBlueCard: [
            { required: true, message: '请选择是否蓝牌货车可做', trigger: 'blur' }
          ],
          loanBankNum: [
            { required: true, message: '请输入银行机构借款申请次数', trigger: 'blur' }
          ],
          loanUnBankNum: [
            { required: true, message: '请输入非银行机构借款申请次数', trigger: 'blur' }
          ],
          recordIdList: [
            { required: true, message: '请选择产品', trigger: 'blur' }
          ],
        }
      }
    },
    components: {
      BusinessSelect
    },
    watch: {
    },
    methods: {
      init (id) {
        this.id = id
        this.visible = true
        this.getAllList()
        if (id) {
          this.getInfo(id)
        }
      },
      getInfo (data) {
        Product.info(data).then(res => {
          const { code, data } = res.data
          if (code === 0) {
            console.log(data)
            this.dataForm = {
              ...data,
              recordIdList: data.recordVos.map(item => item.recordId)
            }
          }
        })
      },
      getAllList () {
        Record.getAllList().then(res => {
          const { code, data } = res.data
          if (code === 0) {
            this.recordList = data
          }
        })
      },
      resetForm() {
        this.$refs['dataForm'].resetFields()
      },
      cancle () {
        this.visible = false
        this.resetForm()
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const params = {
              ...this.dataForm,
              productName: this.dataForm.productName,
              recordIdList: this.dataForm.recordIdList,
              productDetailVo: {
                ...this.dataForm
              }
            }
            Product[this.id ? 'update': 'save'](params).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.resetForm()
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            }).catch(err => {
              console.log(err)
              this.$message.error(err)
            })
          } 
        })
      }
    }
  }
</script>
