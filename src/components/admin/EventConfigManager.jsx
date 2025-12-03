import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { config } from '../../config';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Noto Sans TC', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #232F3E;
`;

const Title = styled.h1`
  color: #232F3E;
  font-size: 28px;
  margin: 0;
`;

const AddButton = styled.button`
  background: #FF9900;
  color: #232F3E;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #EC7211;
    transform: translateY(-1px);
  }
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const EventCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
  border-left: 4px solid ${props => props.$isOpen ? '#2E7D32' : '#9E9E9E'};
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
`;

const EventName = styled.h3`
  color: #232F3E;
  margin: 0 0 10px 0;
  font-size: 18px;
`;

const EventId = styled.code`
  background: #F5F5F5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
`;

const EventMeta = styled.div`
  margin-top: 15px;
  font-size: 14px;
  color: #666;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$isOpen ? '#E8F5E9' : '#EEEEEE'};
  color: ${props => props.$isOpen ? '#2E7D32' : '#666'};
  margin-left: 10px;
`;

const CultureBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #FFF3E0;
  color: #E65100;
  margin-top: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => props.$variant === 'danger' ? '#D32F2F' : '#232F3E'};
  background: ${props => props.$variant === 'danger' ? 'white' : '#232F3E'};
  color: ${props => props.$variant === 'danger' ? '#D32F2F' : 'white'};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

// Modal 樣式
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  color: #232F3E;
  margin: 0 0 20px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #DDD;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #FF9900;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #DDD;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #FF9900;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: ${props => props.$primary ? '#FF9900' : '#EEE'};
  color: ${props => props.$primary ? '#232F3E' : '#666'};

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

// 文化類型選項（單一選擇）
const CULTURE_TYPES = [
  { value: 'tw_fortune', label: '台灣籤詩算命', icon: '🏮', description: '傳統籤詩解讀' },
  { value: 'tw_face', label: '台灣面相算命', icon: '👤', description: '中式面相分析' },
  { value: 'jp_omikuji', label: '日本御神籤', icon: '⛩️', description: 'おみくじ' },
  { value: 'western_tarot', label: '西方塔羅', icon: '🔮', description: 'Tarot Reading' },
];

// 語言選項（目前只支援三種）
const LANGUAGE_OPTIONS = [
  { value: 'zh', label: '繁體中文' },
  { value: 'zhcn', label: '简体中文' },
  { value: 'en', label: 'English' },
];

const EventConfigManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);

  // 表單狀態
  const [formData, setFormData] = useState({
    event_id: '',
    event_name: '',
    start_time: '',
    end_time: '',
    is_open: false,
    culture_types: ['tw_fortune'],  // 改成陣列，支援多選
    supported_languages: ['zh'],
    default_language: 'zh',
  });

  // 載入活動列表
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiEndpoint}/admin/events`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      // 相容舊資料：如果是 culture_type 字串，轉成陣列
      let cultureTypes = event.culture_types || [];
      if (!cultureTypes.length && event.culture_type) {
        cultureTypes = [event.culture_type];
      }
      if (!cultureTypes.length) {
        cultureTypes = ['tw_fortune'];
      }
      
      setFormData({
        event_id: event.event_id,
        event_name: event.event_name,
        start_time: event.start_time?.split('T')[0] || '',
        end_time: event.end_time?.split('T')[0] || '',
        is_open: event.is_open === 1 || event.is_open === true,
        culture_types: cultureTypes,
        supported_languages: event.supported_languages || ['zh'],
        default_language: event.default_language || 'zh',
      });
    } else {
      setEditingEvent(null);
      setFormData({
        event_id: '',
        event_name: '',
        start_time: '',
        end_time: '',
        is_open: false,
        culture_types: ['tw_fortune'],
        supported_languages: ['zh'],
        default_language: 'zh',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => {
      const newArray = checked 
        ? [...prev[field], value]
        : prev[field].filter(v => v !== value);
      
      // 如果是 supported_languages 改變，檢查 default_language 是否還在列表中
      if (field === 'supported_languages') {
        const newDefaultLang = newArray.includes(prev.default_language) 
          ? prev.default_language 
          : (newArray[0] || 'zh');
        return {
          ...prev,
          [field]: newArray,
          default_language: newDefaultLang
        };
      }
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const method = editingEvent ? 'PUT' : 'POST';
      const response = await fetch(`${config.apiEndpoint}/admin/events`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          start_time: formData.start_time + 'T00:00:00',
          end_time: formData.end_time + 'T23:59:59',
          is_open: formData.is_open ? 1 : 0,
        }),
      });

      if (response.ok) {
        await fetchEvents();
        handleCloseModal();
      } else {
        alert('儲存失敗，請重試');
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('儲存失敗：' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm(`確定要刪除活動 "${eventId}" 嗎？`)) return;

    try {
      const response = await fetch(`${config.apiEndpoint}/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEvents();
      } else {
        alert('刪除失敗，請重試');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('刪除失敗：' + error.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-TW');
  };

  const getCultureLabel = (type) => {
    const culture = CULTURE_TYPES.find(c => c.value === type);
    return culture ? `${culture.icon} ${culture.label}` : type;
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>載入中...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🎪 活動配置管理</Title>
        <AddButton onClick={() => handleOpenModal()}>
          + 新增活動
        </AddButton>
      </Header>

      <EventGrid>
        {events.map(event => (
          <EventCard key={event.event_id} $isOpen={event.is_open === 1}>
            <EventName>
              {event.event_name}
              <StatusBadge $isOpen={event.is_open === 1}>
                {event.is_open === 1 ? '開放中' : '已關閉'}
              </StatusBadge>
            </EventName>
            <EventId>{event.event_id}</EventId>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
              {(event.culture_types || (event.culture_type ? [event.culture_type] : [])).map(type => (
                <CultureBadge key={type}>{getCultureLabel(type)}</CultureBadge>
              ))}
            </div>

            <EventMeta>
              <div>📅 {formatDate(event.start_time)} ~ {formatDate(event.end_time)}</div>
              {event.supported_languages && (
                <div>🌐 {event.supported_languages.join(', ')}</div>
              )}
            </EventMeta>

            <ButtonGroup>
              <ActionButton onClick={() => handleOpenModal(event)}>
                編輯
              </ActionButton>
              <ActionButton 
                $variant="danger" 
                onClick={() => handleDelete(event.event_id)}
              >
                刪除
              </ActionButton>
            </ButtonGroup>
          </EventCard>
        ))}
      </EventGrid>

      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>
              {editingEvent ? '編輯活動' : '新增活動'}
            </ModalTitle>

            <FormGroup>
              <Label>活動 ID *</Label>
              <Input
                name="event_id"
                value={formData.event_id}
                onChange={handleInputChange}
                placeholder="例如：aws-summit-tokyo-2025"
                disabled={!!editingEvent}
              />
            </FormGroup>

            <FormGroup>
              <Label>活動名稱 *</Label>
              <Input
                name="event_name"
                value={formData.event_name}
                onChange={handleInputChange}
                placeholder="例如：AWS Summit Tokyo 2025"
              />
            </FormGroup>

            <FormGroup>
              <Label>文化類型 *（可多選）</Label>
              <CheckboxGroup>
                {CULTURE_TYPES.map(type => (
                  <CheckboxLabel key={type.value} style={{ 
                    padding: '8px 12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    background: formData.culture_types.includes(type.value) ? '#FFF3E0' : 'white'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.culture_types.includes(type.value)}
                      onChange={(e) => handleArrayChange('culture_types', type.value, e.target.checked)}
                    />
                    <span>{type.icon} {type.label}</span>
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#888' }}>
                選擇此活動要啟用的功能類型
              </div>
            </FormGroup>

            <FormGroup>
              <Label>支援語言</Label>
              <CheckboxGroup>
                {LANGUAGE_OPTIONS.map(lang => (
                  <CheckboxLabel key={lang.value}>
                    <input
                      type="checkbox"
                      checked={formData.supported_languages.includes(lang.value)}
                      onChange={(e) => handleArrayChange('supported_languages', lang.value, e.target.checked)}
                    />
                    {lang.label}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <Label>預設語言</Label>
              <Select
                name="default_language"
                value={formData.default_language}
                onChange={handleInputChange}
              >
                {formData.supported_languages.map(lang => {
                  const langOption = LANGUAGE_OPTIONS.find(l => l.value === lang);
                  return (
                    <option key={lang} value={lang}>
                      {langOption?.label || lang}
                    </option>
                  );
                })}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>開始日期</Label>
              <Input
                type="date"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>結束日期</Label>
              <Input
                type="date"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="is_open"
                  checked={formData.is_open}
                  onChange={handleInputChange}
                />
                <strong>立即開放活動</strong>
              </CheckboxLabel>
            </FormGroup>

            <ModalButtons>
              <ModalButton onClick={handleCloseModal}>
                取消
              </ModalButton>
              <ModalButton 
                $primary 
                onClick={handleSave}
                disabled={saving || !formData.event_id || !formData.event_name}
              >
                {saving ? '儲存中...' : '儲存'}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default EventConfigManager;
